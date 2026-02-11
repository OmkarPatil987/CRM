import { Suspense, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppBar, Dialog, IconButton, Toolbar, Typography, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import PageLoader from "../loader/LoaderText";
import { RootState } from "../../redux/store";
import { closeDialog } from "../../redux/reducer/dialogSlice";
import dialogComponents from "./MapDialogComponents";

const CommonDialogComponent = () => {
    const dispatch = useDispatch();
    const { isOpen, isFullScreen, title, size = "md", type } = useSelector((state: RootState) => state.dialog);
    const DialogComponent = type ? dialogComponents[type] : null;

    const handleClose = useCallback(() => {
        dispatch(closeDialog());
    }, [dispatch]);

    return (
        <Dialog
            open={isOpen}
            fullScreen={isFullScreen}
            fullWidth
            maxWidth={size as "xs" | "sm" | "md" | "lg" | "xl"}
            PaperProps={{
                sx: {
                    borderRadius: isFullScreen ? 0 : 2,
                    boxShadow: 4,
                    overflowY: "unset",
                },
            }}
            slotProps={{
                backdrop: {
                    sx: {
                        backdropFilter: "blur(2px) sepia(8%)",
                        backgroundColor: "rgba(0, 0, 0, 0.51)",
                    },
                },
            }}
        >
            {isFullScreen && (
                <AppBar elevation={7} sx={{ position: "relative", height: 59 }}>
                    <Toolbar sx={{ justifyContent: "space-between" }}>
                        <Typography variant="h5" fontWeight="h4.fontWeight">
                            {title}
                        </Typography>
                        <IconButton edge="start" color="inherit" onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            )}

            <Suspense fallback={<PageLoader />}>
                {DialogComponent && <DialogComponent />}
            </Suspense>
        </Dialog>
    );
};

export default CommonDialogComponent;
