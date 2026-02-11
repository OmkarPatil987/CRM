import { Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { FC } from "react";

interface ActiveChipProps {
    isActive: boolean;
    onClick?: () => void;
    size?: "small" | "medium";
    variant?: "outlined" | "filled";
}

const ActiveChip: FC<ActiveChipProps> = ({ isActive, onClick, size = "small", variant = "outlined", }) => {
    const config = isActive
        ? {
            label: "Active",
            color: "success" as const,
            icon: <CheckCircleIcon fontSize="small" />,
        }
        : {
            label: "Inactive",
            color: "error" as const,
            icon: <CancelIcon fontSize="small" />,
        };

    return (
        <Chip
            label={config.label}
            color={config.color}
            icon={config.icon}
            size={size}
            variant={variant}
            onClick={onClick}
            sx={{
                fontWeight: 500,
                borderRadius: 2,
                cursor: onClick ? "pointer" : "default",
                px: 1.2,
                textTransform: "capitalize",
            }}
        />
    );
};

export default ActiveChip;
