import { Chip } from "@mui/material";
import { CheckCircle, LocalOffer } from "@mui/icons-material";

interface QRStatusChipProps {
    generated: boolean;
}

const QRStatusChip: React.FC<QRStatusChipProps> = ({ generated }) => (
    <Chip
        icon={generated ? <CheckCircle sx={{ fontSize: 16 }} /> : <LocalOffer sx={{ fontSize: 16 }} />}
        label={generated ? "Generated" : "Pending"}
        size="small"
        color={generated ? "success" : "warning"}
        variant="filled"
        sx={{ fontWeight: 600 }}
    />
);

export default QRStatusChip;
