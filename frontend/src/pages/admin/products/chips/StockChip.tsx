import { Chip } from "@mui/material";
import { Error, Warning, Warehouse } from "@mui/icons-material";
import { getStockStatus } from "../utils/productUtils";

interface StockChipProps {
    stock: number;
}

const StockChip: React.FC<StockChipProps> = ({ stock }) => {
    const { label, severity } = getStockStatus(stock);

    const iconMap = {
        error: <Error sx={{ fontSize: 16 }} />,
        warning: <Warning sx={{ fontSize: 16 }} />,
        success: <Warehouse sx={{ fontSize: 16 }} />,
    };

    return (
        <Chip
            icon={iconMap[severity]}
            label={label}
            size="small"
            color={severity}
            variant="filled"
            sx={{ fontWeight: 600 }}
        />
    );
};

export default StockChip;
