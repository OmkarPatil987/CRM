import { Chip } from "@mui/material";
import { CheckCircle, CancelOutlined } from "@mui/icons-material";

interface StatusChipProps {
    status: "active" | "inactive";
}

const StatusChip: React.FC<StatusChipProps> = ({ status }) => (
    <Chip
        icon={status === "active" ? <CheckCircle sx={{ fontSize: 16 }} /> : <CancelOutlined sx={{ fontSize: 16 }} />}
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        size="small"
        color={status === "active" ? "success" : "default"}
        variant={status === "active" ? "filled" : "outlined"}
        sx={{ fontWeight: 600 }}
    />
);

export default StatusChip;
