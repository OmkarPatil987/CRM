import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// MUI Imports
import {
    Box, Paper, Button, TextField, IconButton, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    Typography, Stack, Skeleton, InputAdornment, Tabs, Tab, TablePagination,
    Tooltip
} from "@mui/material";

// Icons
import {
    Add, Search, Visibility, QrCode, MoreVert,
    BugReportOutlined, PsychologyOutlined, LayersOutlined,
    Edit, Delete, WaterDropOutlined
} from "@mui/icons-material";

import { RootState } from "../../../../redux/store";
import { resetRefresh } from "../../../../redux/reducer/refreshSlice";
import { FetchProductListService } from "../../../../utils/services/product.service";
import { showSnackbar } from "../../../../redux/reducer/snackbarSlice";
import { openDialog } from "../../../../redux/reducer/dialogSlice";

const ProductList: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [productList, setProductList] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [activeTab, setActiveTab] = useState(0);

    const [payload, setPayload] = useState({
        offset: 0,
        limit: 15,
        search: "",
        category: "",
        status: "all",
    });

    const refresh = useSelector((state: RootState) => state.refresh.createProduct);

    const getProductList = useCallback(async () => {
        setLoading(true);
        try {
            const apiPayload = {
                ...payload,
                status: payload.status === "all" ? undefined : payload.status
            };
            const { code, data } = await FetchProductListService(apiPayload);
            if (code === 200 && data?.data) {
                setProductList(data.data);
                setTotalCount(data.total_count || data.data.length);
                dispatch(resetRefresh());
            } else {
                setProductList([]);
                setTotalCount(0);
            }
        } catch (error) {
            dispatch(showSnackbar({ type: "error", message: "Failed to fetch products." }));
        } finally {
            setLoading(false);
        }
    }, [payload, refresh, dispatch]);

    useEffect(() => { getProductList(); }, [getProductList]);

    const handleViewProduct = (product: any) => navigate(`/admin/products/details?uuid=${product.uuid}`);
    const handleEditProduct = (product: any) => navigate(`/admin/products/create?uuid=${product.uuid}`);
    const handleCreateProduct = () => navigate("/admin/products/create");

    const handleDeleteProduct = (product: any) => {
        dispatch(
            openDialog({
                title: `Delete Product`,
                type: "CommonDeleteDialog",
                size: 'sm',
                moduleType: "product",
                payload: {
                    data: product.id,
                    request: { product_uuid: product.uuid },
                    url: "product/delete",
                    message: `Are you sure you want to delete ${product.name}?`,
                    refresh: "createProduct",
                },
            })
        );
    };

    const getCategoryIcon = (category: string) => {
        const cat = category?.toLowerCase();
        if (cat?.includes('fertilizer')) return <WaterDropOutlined sx={{ color: '#19b369' }} />;
        if (cat?.includes('pest')) return <BugReportOutlined sx={{ color: '#19b369' }} />;
        if (cat?.includes('seed')) return <PsychologyOutlined sx={{ color: '#19b369' }} />;
        return <LayersOutlined sx={{ color: '#19b369' }} />;
    };

    return (
        <Box className="w-full px-4 py-4 font-display bg-[#f6f8f7] min-h-screen">
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={4} gap={3}>
                <Box>
                    <Typography variant="h4" sx={{ color: "#0e1b15", fontWeight: 900, letterSpacing: '-0.02em' }}>Products</Typography>
                    <Typography variant="body2" sx={{ color: "#509574" }}>Manage and track QR compliance for your agricultural inventory.</Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        onClick={handleCreateProduct}
                        variant="contained"
                        startIcon={<Add />}
                        sx={{ bgcolor: '#19b369', color: '#fff', borderRadius: '0.75rem', px: 3, height: 44, fontWeight: 700, boxShadow: '0 4px 12px rgba(25, 179, 105, 0.2)', '&:hover': { bgcolor: '#159658' } }}
                    >
                        Add Product
                    </Button>
                </Stack>
            </Box>

            <Paper elevation={0} sx={{ border: '1px solid #d1e6dc', borderRadius: '1rem', overflow: 'hidden' }}>
                <Box sx={{ borderBottom: '1px solid #d1e6dc', px: 3, pt: 1, bgcolor: 'rgba(255,255,255,0.5)' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Tabs
                            value={activeTab}
                            onChange={(_, v) => {
                                setActiveTab(v);
                                const status = v === 1 ? "active" : v === 2 ? "archived" : "all";
                                setPayload(p => ({ ...p, status, offset: 0 }));
                            }}
                            sx={{ '& .MuiTabs-indicator': { backgroundColor: '#19b369', height: 3 } }}
                        >
                            <Tab label={`All Products (${totalCount})`} sx={{ textTransform: 'none', fontWeight: 700, color: '#509574', minHeight: 60, '&.Mui-selected': { color: '#19b369' } }} />
                            <Tab label="Active" sx={{ textTransform: 'none', fontWeight: 700, color: '#509574', minHeight: 60 }} />
                            <Tab label="Archived" sx={{ textTransform: 'none', fontWeight: 700, color: '#509574', minHeight: 60 }} />
                        </Tabs>

                        <TextField
                            size="small"
                            placeholder="Search by name or code..."
                            value={payload.search}
                            onChange={(e) => setPayload(p => ({ ...p, search: e.target.value, offset: 0 }))}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Search sx={{ color: '#509574' }} /></InputAdornment>,
                                sx: { bgcolor: '#e8f3ed', border: 'none', borderRadius: '0.75rem', '& fieldset': { border: 'none' }, width: 300, height: 40 }
                            }}
                        />
                    </Stack>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fbfa' }}>
                            <TableRow>
                                <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#0e1b15', textTransform: 'uppercase', py: 2 }}>Product Details</TableCell>
                                <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#0e1b15', textTransform: 'uppercase' }}>Manufacturer</TableCell>
                                <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#0e1b15', textTransform: 'uppercase' }}>Classification</TableCell>
                                <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#0e1b15', textTransform: 'uppercase' }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#509574', textTransform: 'uppercase' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <TableRow key={i}><TableCell colSpan={5}><Skeleton height={60} /></TableCell></TableRow>
                                ))
                            ) : productList.length > 0 ? productList.map((row) => (
                                <TableRow key={row.uuid} hover sx={{ '&:hover': { bgcolor: '#f0f9f4' }, transition: 'background-color 0.2s' }}>
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Box sx={{ bgcolor: '#e8f3ed', p: 1.25, borderRadius: '0.5rem', display: 'flex' }}>
                                                {getCategoryIcon(row.category)}
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: '#0e1b15', fontWeight: 600 }}>{row.name}</Typography>
                                                <Typography variant="caption" sx={{ color: '#509574', display: 'block' }}>Code: {row.product_code || 'N/A'}</Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: '#509574', fontWeight: 500 }}>{row.company_name || 'Quantum'}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: '#0e1b15', fontWeight: 500 }}>{row.category}</Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(80, 149, 116, 0.8)' }}>{row.sub_category}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{
                                                width: 8, height: 8, borderRadius: '50%',
                                                bgcolor: (row.status === true || row.status === 'active') ? '#19b369' : '#ef4444'
                                            }} />
                                            <Typography variant="body2" sx={{ color: '#0e1b15', fontWeight: 500 }}>
                                                {(row.status === true || row.status === 'active') ? 'Active' : 'Inactive'}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                            <Tooltip title="View Details">
                                                <IconButton size="small" onClick={() => handleViewProduct(row)} sx={{ color: '#509574', '&:hover': { color: '#19b369' } }}>
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit Product">
                                                <IconButton size="small" onClick={() => handleEditProduct(row)} sx={{ color: '#509574', '&:hover': { color: '#19b369' } }}>
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" onClick={() => handleDeleteProduct(row)} sx={{ color: '#509574', '&:hover': { color: '#ef4444' } }}>
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 8, color: '#509574' }}>No products found matching your criteria.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ bgcolor: '#f8fbfa', borderTop: '1px solid #d1e6dc' }}>
                    <TablePagination
                        component="div"
                        count={totalCount}
                        page={payload.offset / payload.limit}
                        onPageChange={(_, newPage) => setPayload(p => ({ ...p, offset: newPage * p.limit }))}
                        rowsPerPage={payload.limit}
                        onRowsPerPageChange={(e) => setPayload(p => ({ ...p, limit: +e.target.value, offset: 0 }))}
                        rowsPerPageOptions={[10, 15, 25]}
                        sx={{
                            color: '#509574',
                            '& .MuiTablePagination-selectIcon': { color: '#509574' },
                            '& .MuiTablePagination-actions': { color: '#19b369' }
                        }}
                    />
                </Box>
            </Paper>
        </Box>
    );
};

export default ProductList;