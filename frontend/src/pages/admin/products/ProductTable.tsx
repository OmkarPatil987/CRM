import {
    Table,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    Button,
    Box,
    Typography,
    CircularProgress,
    Stack,
    Tooltip,
} from "@mui/material";
import { Inventory2Outlined, ImageNotSupported } from "@mui/icons-material";
import dayjs from "dayjs";
import TableHeadList from "../../../components/common/table/TableHeadList";
import CategoryChip from "./chips/CategoryChip";
import StatusChip from "./chips/StatusChip";
import StockChip from "./chips/StockChip";
import QRStatusChip from "./chips/QRStatusChip";
import ProductActions from "./ProductActions";
import { productHeadCells } from "./constants/productConstants";

interface ProductTableProps {
    products: any[];
    loading: boolean;
    onView: (product: any) => void;
    onEdit: (product: any) => void;
    onGenerateQR: (product: any) => void;
    onDownloadQR: (product: any) => void;
    onDelete: (product: any) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
    products,
    loading,
    onView,
    onEdit,
    onGenerateQR,
    onDownloadQR,
    onDelete,
}) => (
    <TableContainer
        sx={{
            minHeight: "calc(90vh - 160px)",
            maxHeight: "calc(90vh - 160px)",
        }}
    >
        <Table
            stickyHeader
            aria-label="Product table"
            size="small"
            sx={{ minWidth: 1200, tableLayout: "auto" }}
        >
            <TableHeadList headCells={productHeadCells} />
            {loading && (
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={productHeadCells.length} style={{ padding: 0 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    minHeight: "300px",
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        </TableCell>
                    </TableRow>
                </TableBody>
            )}

            <TableBody>
                {!loading && products.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={productHeadCells.length} style={{ textAlign: "center", padding: "40px 20px" }}>
                            <Typography variant="body1" color="textSecondary">
                                No products found
                            </Typography>
                        </TableCell>
                    </TableRow>
                )}
                {!loading &&
                    products.length > 0 &&
                    products.map((product: any) => (
                        <TableRow
                            key={product.id}
                            hover
                            sx={{
                                "&:hover": {
                                    backgroundColor: "action.hover",
                                },
                            }}
                        >
                            {/* Actions */}
                            <TableCell
                                align="center"
                                sx={{
                                    padding: "12px 8px",
                                    width: "80px",
                                    minWidth: "80px",
                                }}
                            >
                                <ProductActions
                                    variant="table"
                                    product={product}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onGenerateQR={onGenerateQR}
                                    onDownloadQR={onDownloadQR}
                                    onDelete={onDelete}
                                />
                            </TableCell>

                            {/* Product ID / Code */}
                            <TableCell
                                sx={{
                                    padding: "12px 8px",
                                    width: "120px",
                                    minWidth: "120px",
                                    position: "sticky",
                                    left: 80,
                                    zIndex: 4,
                                    backgroundColor: "background.paper",
                                }}
                            >
                                <Button
                                    variant="text"
                                    size="small"
                                    sx={{
                                        p: 0,
                                        fontSize: "0.85rem",
                                        fontWeight: 600,
                                        color: "primary.main",
                                        textTransform: "none",
                                        "&:hover": {
                                            textDecoration: "underline",
                                            backgroundColor: "transparent",
                                        },
                                    }}
                                    onClick={() => onView(product)}
                                >
                                    {/* Prefer product_code if available, else ID */}
                                    {product.product_code || `#${product.id}`}
                                </Button>
                            </TableCell>

                            {/* Image Placeholder + Name Combined */}
                            <TableCell
                                sx={{
                                    padding: "8px 12px",
                                    width: "280px",
                                    minWidth: "280px",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        cursor: "pointer",
                                        "&:hover .product-name": {
                                            color: "primary.main",
                                        },
                                    }}
                                    onClick={() => onView(product)}
                                >
                                    {/* Placeholder for Image since API doesn't have thumbnail */}
                                    <Box
                                        sx={{
                                            flexShrink: 0,
                                            width: 50,
                                            height: 50,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "grey.100",
                                            borderRadius: 1,
                                            border: "1px solid",
                                            borderColor: "divider",
                                            color: "text.secondary"
                                        }}
                                    >
                                        <Inventory2Outlined fontSize="small" />
                                    </Box>

                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                        <Tooltip title={product.product_name}>
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                                className="product-name"
                                                sx={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                    transition: "color 0.2s",
                                                    color: "text.primary",
                                                    maxWidth: "200px"
                                                }}
                                            >
                                                {product.product_name}
                                            </Typography>
                                        </Tooltip>
                                        <Typography
                                            variant="caption"
                                            color="textSecondary"
                                            sx={{
                                                display: "block",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {product.brand || "No Brand"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </TableCell>

                            {/* Category */}
                            <TableCell
                                sx={{
                                    padding: "12px 8px",
                                    width: "140px",
                                    minWidth: "140px",
                                }}
                            >
                                <CategoryChip category={product.category} />
                            </TableCell>


                            {/* Stock */}
                            <TableCell
                                align="center"
                                sx={{
                                    padding: "12px 8px",
                                    width: "100px",
                                    minWidth: "100px",
                                }}
                            >
                                {/* Using stock_qty from JSON */}
                                <StockChip stock={product.stock_qty || 0}  />
                            </TableCell>

                            {/* Status */}
                            <TableCell
                                align="center"
                                sx={{
                                    padding: "12px 8px",
                                    width: "110px",
                                    minWidth: "110px",
                                }}
                            >
                                {/* Converting boolean is_active to string for Chip */}
                                <StatusChip status={product.is_active ? "active" : "inactive"} />
                            </TableCell>

                            {/* QR Status */}
                            <TableCell
                                align="center"
                                sx={{
                                    padding: "12px 8px",
                                    width: "100px",
                                    minWidth: "100px",
                                }}
                            >
                                {/* Checking if path exists to determine status */}
                                <QRStatusChip generated={!!product.qr_code_path} />
                            </TableCell>

                            {/* Created Date */}
                            <TableCell
                                sx={{
                                    padding: "12px 8px",
                                    width: "130px",
                                    minWidth: "130px",
                                }}
                            >
                                <Typography variant="body2">
                                    {dayjs(product.created_at).format("DD MMM YYYY")}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    </TableContainer>
);

export default ProductTable;