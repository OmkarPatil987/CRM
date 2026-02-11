import { IconButton, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import {
    MoreVert,
    VisibilityOutlined,
    EditOutlined,
    QrCode2Outlined,
    DownloadOutlined,
    DeleteOutlineOutlined,
} from "@mui/icons-material";
import { useState } from "react";

interface ProductActionsProps {
    product: any;
    onView: (product: any) => void;
    onEdit: (product: any) => void;
    onGenerateQR: (product: any) => void;
    onDownloadQR: (product: any) => void;
    onDelete: (product: any) => void;
    variant?: "table" | "card";
}

const ProductActions: React.FC<ProductActionsProps> = ({
    product,
    onView,
    onEdit,
    onGenerateQR,
    onDownloadQR,
    onDelete,
    variant = "card",
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAction = (action: () => void) => {
        action();
        handleClose();
    };

    // Table variant with MoreVert icon and Popover menu
    if (variant === "table") {
        return (
            <>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? "long-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                    size="small"
                >
                    <MoreVert fontSize="small" />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        "aria-labelledby": "long-button",
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    slotProps={{
                        paper: {
                            style: {
                                maxHeight: 48 * 4.5,
                                width: "20ch",
                            },
                        },
                    }}
                >
                    <MenuItem onClick={() => handleAction(() => onView(product))}>
                        <ListItemIcon>
                            <VisibilityOutlined fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>View</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleAction(() => onEdit(product))}>
                        <ListItemIcon>
                            <EditOutlined fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Edit</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleAction(() => onGenerateQR(product))}>
                        <ListItemIcon>
                            <QrCode2Outlined fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Generate QR</ListItemText>
                    </MenuItem>
                    <MenuItem
                        onClick={() => handleAction(() => onDownloadQR(product))}
                        disabled={!product.qr_generated}
                    >
                        <ListItemIcon>
                            <DownloadOutlined fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Download QR</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleAction(() => onDelete(product))}>
                        <ListItemIcon>
                            <DeleteOutlineOutlined fontSize="small" sx={{ color: "error.main" }} />
                        </ListItemIcon>
                        <ListItemText sx={{ color: "error.main" }}>Delete</ListItemText>
                    </MenuItem>
                </Menu>
            </>
        );
    }

    // Card variant with horizontal icon buttons (original style)
    return (
        <>
            <IconButton size="small" onClick={() => onView(product)} color="primary">
                <Tooltip title="View" placement="top">
                    <VisibilityOutlined fontSize="small" />
                </Tooltip>
            </IconButton>
            <IconButton size="small" onClick={() => onEdit(product)} color="inherit">
                <Tooltip title="Edit" placement="top">
                    <EditOutlined fontSize="small" />
                </Tooltip>
            </IconButton>
            <IconButton size="small" onClick={() => onGenerateQR(product)} color="success">
                <Tooltip title="Generate QR" placement="top">
                    <QrCode2Outlined fontSize="small" />
                </Tooltip>
            </IconButton>
            <IconButton size="small" onClick={() => onDownloadQR(product)} color="info" disabled={!product.qr_generated}>
                <Tooltip title="Download QR" placement="top">
                    <DownloadOutlined fontSize="small" />
                </Tooltip>
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(product)} color="error">
                <Tooltip title="Delete" placement="top">
                    <DeleteOutlineOutlined fontSize="small" />
                </Tooltip>
            </IconButton>
        </>
    );
};

export default ProductActions;
