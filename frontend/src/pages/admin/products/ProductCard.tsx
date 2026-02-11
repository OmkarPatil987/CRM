import { Card, CardContent, CardActions, Typography, Box, Divider } from "@mui/material";
import { Inventory2Outlined } from "@mui/icons-material";
import CategoryChip from "./chips/CategoryChip";
import StatusChip from "./chips/StatusChip";
import StockChip from "./chips/StockChip";
import ProductActions from "./ProductActions";

interface ProductCardProps {
    product: any;
    onView: (product: any) => void;
    onEdit: (product: any) => void;
    onGenerateQR: (product: any) => void;
    onDownloadQR: (product: any) => void;
    onDelete: (product: any) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onView,
    onEdit,
    onGenerateQR,
    onDownloadQR,
    onDelete,
}) => (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
        {/* Placeholder Image Area */}
        <Box
            sx={{
                height: 160,
                width: "100%",
                bgcolor: "primary.light",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.1,
                position: "absolute",
                top: 0,
                left: 0,
            }}
        >
            {/* Background tint only */}
        </Box>

        <Box
            sx={{
                height: 160,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "transparent",
                zIndex: 1
            }}
        >
            <Inventory2Outlined sx={{ fontSize: 60, color: "primary.main", opacity: 0.7 }} />
        </Box>

        <CardContent sx={{ flexGrow: 1, pt: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="caption" color="text.secondary">
                    {product.product_code || `#${product.id}`}
                </Typography>
                <StatusChip status={product.is_active ? "active" : "inactive"} />
            </Box>

            <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                sx={{
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    height: '3.6em',
                    lineHeight: '1.2em'
                }}
                title={product.product_name}
            >
                {product.product_name}
            </Typography>

            <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                <CategoryChip category={product.category} />
                {product.grade && (
                    <Typography variant="caption" sx={{ bgcolor: 'grey.100', px: 1, py: 0.5, borderRadius: 1 }}>
                        {product.grade}
                    </Typography>
                )}
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="flex-end">
                <Typography variant="h6" color="primary" fontWeight={700}>
                    ₹{(product.selling_price || 0).toLocaleString()}
                </Typography>
                <StockChip stock={product.stock_qty || 0}  />
            </Box>
        </CardContent>

        <Divider />

        <CardActions sx={{ p: 1.5, justifyContent: 'center' }}>
            <ProductActions
                product={product}
                onView={onView}
                onEdit={onEdit}
                onGenerateQR={onGenerateQR}
                onDownloadQR={onDownloadQR}
                onDelete={onDelete}
            />
        </CardActions>
    </Card>
);

export default ProductCard;