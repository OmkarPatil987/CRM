import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import { closeDialog } from "../../../redux/reducer/dialogSlice";
import { setModuleRefresh } from "../../../redux/reducer/refreshSlice";
import { DeleteNgoActivityDocumentSerivce } from "../../../utils/services/ngo.registration.service";
import GlobalDialogContent from "../GlobalDialogContent";
import { RootState } from "../../../redux/store";

const DeleteMediaDocument: React.FC = () => {
    const dispatch = useDispatch();
    const uuid = useSelector((state: RootState) => state.dialog.payload);

    const handleSubmit = async () => {
        if (!uuid) {
            dispatch(showSnackbar({ type: "error", message: "Document UUID not found" }));
            return;
        }

        const payloadData = {
            document_uuid: uuid,
        };

        const { code, message } = await DeleteNgoActivityDocumentSerivce(payloadData);
        if (code === 200) {
            dispatch(showSnackbar({ type: "success", message: message || "Document deleted successfully." }));
            dispatch(closeDialog());
            dispatch(setModuleRefresh({ moduleName: "media", refresh: true }));
        } else {
            dispatch(showSnackbar({ type: "error", message: message || "Failed to delete document." }));
        }
    };

    return (
        <GlobalDialogContent
            dialogBody={
                <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
                    <img src="/images/3173472.jpg" alt="Delete" style={{ width: 80, borderRadius: 8 }} />
                    <Typography variant="h5" fontWeight={600}>Delete Media Document</Typography>
                    <Typography variant="body2" color="textSecondary" align="center" maxWidth={400}>
                        Are you sure you want to delete this media document? This action cannot be undone.
                    </Typography>
                </Box>
            }
            dialogFooter={
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleSubmit}
                    sx={{ borderRadius: 3 }}
                >
                    Delete
                </Button>
            }
        />
    );
};

export default DeleteMediaDocument;
