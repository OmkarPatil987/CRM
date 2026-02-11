import { Chip, Tooltip } from "@mui/material";
import Business from "@mui/icons-material/Business";
import AdminPanelSettings from "@mui/icons-material/AdminPanelSettings";
import LocationCity from "@mui/icons-material/LocationCity";
import Groups from "@mui/icons-material/Groups";
import HelpOutline from "@mui/icons-material/HelpOutline";
import { Factory, Person2 } from "@mui/icons-material";

const userTypeConfig: Record<
    string,
    { label: string; icon: JSX.Element; color: "primary" | "success" | "info" | "error" | "warning" | "secondary" }
> = {
    implementing_agency: { label: "Implementing Agency", icon: <Business fontSize="small" />, color: "primary" },
    admin_officer: { label: "Admin Officer", icon: <AdminPanelSettings fontSize="small" />, color: "secondary" },
    district_official: { label: "District Official", icon: <LocationCity fontSize="small" />, color: "info" },
    participant_msme: { label: "Participant (MSME)", icon: <Groups fontSize="small" />, color: "success" },
    industry: { label: "Industry", icon: <Factory fontSize="small" />, color: "warning" },
    our_team: { label: "Our Team", icon: <Groups fontSize="small" />, color: "error" },
    dc: { label: "DC", icon: <Person2 fontSize="small" />, color: "info" },
};

const UserStatusChip: React.FC<{ status: string; onClick?: () => void }> = ({ status: userType, onClick }) => {
    const config =
        userTypeConfig[userType?.toLowerCase()] ?? {
            label: userType,
            icon: <HelpOutline fontSize="small" />,
            color: "default",
        };

    return (
        <Tooltip title={config.label} placement="top" arrow>
            <Chip
                size="small"
                label={config.label}
                icon={config.icon}
                color={config.color as any}
                variant="outlined"
                onClick={onClick}
                sx={{ cursor: onClick ? "pointer" : "default" }}
            />
        </Tooltip>
    );
};

export default UserStatusChip;
