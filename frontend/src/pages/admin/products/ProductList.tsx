import { Box, Paper, Grid, Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Add, Inventory2Outlined } from "@mui/icons-material";
import { RootState } from "../../../redux/store";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import { openDialog } from "../../../redux/reducer/dialogSlice";
import PageHead from "../../../components/common/page/PageHead";
import CustomPagination from "../../../components/common/table/TablePagination";
import ProductFilters from "./ProductFilters";
import ProductTable from "./ProductTable";
import ProductCard from "./ProductCard";
import { FetchProductListService } from "../../../utils/services/product.service";
import { resetRefresh } from "../../../redux/reducer/refreshSlice";
// Import your service here
// import { FetchProductListService } from "../../../services/productService";

const ProductList: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Loader state
    const [loading, setLoading] = useState(true);

    // Data states
    const [searchKeyword, setSearchKeyword] = useState("");
    const [productList, setProductList] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [viewMode, setViewMode] = useState<"table" | "cards">("table");

    // Filter states
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [sortBy, setSortBy] = useState("created_at");

    const [payload, setPayload] = useState({
        offset: 0,
        limit: 15,
        search: "",
        categories: [] as string[],
        status: "all",
        min_price: 0,
        max_price: 10000,
        sort_by: "created_at",
        order_by: "desc",
    });

    const refresh = useSelector((state: RootState) => state.refresh.createProduct);

    // Update payload when filters change
    useEffect(() => {
        setPayload((prev) => ({
            ...prev,
            search: searchKeyword,
            categories: selectedCategories,
            status: statusFilter,
            min_price: priceRange[0],
            max_price: priceRange[1],
            sort_by: sortBy,
            offset: 0, // Reset to first page on filter change
        }));
    }, [searchKeyword, selectedCategories, statusFilter, priceRange, sortBy]);

    // --- API Call Implementation ---
    const getProductList = useCallback(async () => {
        setLoading(true);
        try {
            // Passing 'payload' to send filters/pagination to the backend
            const { code, data } = await FetchProductListService(payload);

            if (code === 200 && data && data.data) {
                setProductList(data.data);
                setTotalCount(data.total_count);
                dispatch(resetRefresh())
            } else {
                // Handle unexpected response format or empty data
                setProductList([]);
                setTotalCount(0);
                dispatch(
                    showSnackbar({
                        type: "error",
                        message: "Failed to load products. Please try again.",
                    })
                );
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setProductList([]);
            dispatch(
                showSnackbar({
                    type: "error",
                    message: "Something went wrong while fetching products.",
                })
            );
        } finally {
            setLoading(false);
        }
    }, [payload, refresh, dispatch]);

    useEffect(() => {
        getProductList();
    }, [getProductList]);

    const handlePageChange = useCallback((_event: React.ChangeEvent<unknown>, newPage: number) => {
        setPayload((prev) => ({ ...prev, offset: newPage - 1 }));
    }, []);

    const handleRowsPerPageChange = useCallback((event: any) => {
        setPayload((prev) => ({
            ...prev,
            limit: Number(event.target.value),
            offset: 0,
        }));
    }, []);

    // --- Action Handlers ---

    const handleViewProduct = (product: any) => {
        navigate(`/admin/products/details?uuid=${product.uuid}`);
    };

    const handleEditProduct = (product: any) => {
        navigate(`/admin/products/create?uuid=${product.uuid}`);
    };

    const handleGenerateQR = (product: any) => {
        dispatch(
            showSnackbar({
                type: "info",
                message: `Generating QR code for ${product.product_name}...`,
            })
        );
    };

    const handleDownloadQR = (product: any) => {
        dispatch(
            showSnackbar({
                type: "success",
                message: `Downloading QR code for ${product.product_name}`,
            })
        );
    };

    const handleDeleteProduct = (product: any) => {
        dispatch(
            openDialog({
                title: `Delete Product`,
                type: "CommonDeleteDialog",
                isFullScreen: false,
                size: "sm",
                moduleType: "product",
                payload: {
                    data: product.id,
                    request: { product_uuid: product.uuid },
                    url: "product/delete",
                    message: `Are you sure you want to delete ${product.product_name}? This action cannot be undone.`,
                    refresh: "createProduct",
                },
            })
        );
    };

    const handleCreateProduct = () => {
        navigate("/admin/products/create");
    };

    return (
        <Box>
            <Box sx={{ px: 2 }}>
                <PageHead
                    primary="Product Management"
                    back={<Inventory2Outlined />}
                    secondary={
                        <Button onClick={handleCreateProduct} endIcon={<Add />} variant="contained">
                            Add Product
                        </Button>
                    }
                />
            </Box>

            <Box>
                <Paper sx={{ width: "100%", overflow: "hidden", pb: 1 }}>
                    <ProductFilters
                        searchKeyword={searchKeyword}
                        selectedCategories={selectedCategories}
                        statusFilter={statusFilter}
                        sortBy={sortBy}
                        viewMode={viewMode}
                        onSearchChange={setSearchKeyword}
                        onCategoryChange={setSelectedCategories}
                        onStatusChange={setStatusFilter}
                        onSortChange={setSortBy}
                        onViewModeChange={setViewMode}
                    />

                    {viewMode === "table" && (
                        <ProductTable
                            products={productList}
                            loading={loading} // Loader passed to Table
                            onView={handleViewProduct}
                            onEdit={handleEditProduct}
                            onGenerateQR={handleGenerateQR}
                            onDownloadQR={handleDownloadQR}
                            onDelete={handleDeleteProduct}
                        />
                    )}

                    {viewMode === "cards" && (
                        <Box sx={{ p: 2, minHeight: "calc(90vh - 300px)" }}>
                            <Grid container spacing={3}>
                                {/* Show Skeleton loader if loading */}
                                {loading ? (
                                    Array.from(new Array(6)).map((_, index) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                            {/* Assuming ProductCard has a skeleton mode or you use Mui Skeleton here */}
                                            <Paper sx={{ height: 300, bgcolor: '#f5f5f5' }} />
                                        </Grid>
                                    ))
                                ) : (
                                    productList.map((product: any) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                                            <ProductCard
                                                product={product}
                                                onView={handleViewProduct}
                                                onEdit={handleEditProduct}
                                                onGenerateQR={handleGenerateQR}
                                                onDownloadQR={handleDownloadQR}
                                                onDelete={handleDeleteProduct}
                                            />
                                        </Grid>
                                    ))
                                )}
                            </Grid>
                        </Box>
                    )}

                    <CustomPagination
                        count={totalCount}
                        rowsPerPage={payload.limit}
                        page={payload.offset + 1}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                    />
                </Paper>
            </Box>
        </Box>
    );
};

export default ProductList;