import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Stack,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Divider
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import { closeDialog } from "../../../redux/reducer/dialogSlice";
import { setModuleRefresh } from "../../../redux/reducer/refreshSlice";
import { UpdateNgoStatusSerivce } from "../../../utils/services/ngo.registration.service";
import GlobalDialogContent from "../GlobalDialogContent";
import { RootState } from "../../../redux/store";
import { closeDrawer } from "../../../redux/reducer/drawerSlice";

const NGOApproveRejectForm: React.FC = () => {
    const dispatch = useDispatch();
    const [comment, setComment] = useState("");
    const [status, setStatus] = useState<"approved" | "rejected" | "compliance" | "">("");
    const { payload } = useSelector((state: RootState) => state.dialog);

    const handleSubmit = async () => {
        if (!status) {
            dispatch(showSnackbar({ type: "error", message: "Please select a status." }));
            return;
        }
        if (!comment.trim()) {
            dispatch(showSnackbar({ type: "error", message: "Please add a comment." }));
            return;
        }
        if (!payload?.uuid) return;

        const payloadData = {
            uuid: payload.uuid,
            status,
            comments: comment,
            entity_type: "ngo",
        };

        const { code, message } = await UpdateNgoStatusSerivce(payloadData);
        if (code === 200) {
            dispatch(showSnackbar({ type: "success", message: message || "NGO status updated successfully." }));
            dispatch(closeDialog())
            dispatch(closeDrawer())
            dispatch(setModuleRefresh({ moduleName: "ngo", refresh: true }));
        } else {
            dispatch(showSnackbar({ type: "error", message: message || "Something went wrong." }));
        }
    };

    const getButtonLabel = () => {
        switch (status) {
            case "approved": return "Submit as Approved";
            case "rejected": return "Submit as Rejected";
            case "compliance": return "Mark for Compliance";
            default: return "Submit";
        }
    };

    return (
        <GlobalDialogContent
            dialogBody={
                <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
                    <img src="/images/ngo.png" alt="NGO" style={{ width: 80, borderRadius: 8 }} />
                    <Typography variant="h5" fontWeight={600}>NGO Status Update</Typography>
                    <Typography variant="body2" color="textSecondary" align="center" maxWidth={400}>
                        Please review and update the status of this NGO along with an appropriate comment.
                    </Typography>

                    <FormControl component="fieldset" sx={{ width: '100%' }}>
                        <FormLabel>Status *</FormLabel>
                        <RadioGroup
                            row
                            value={status}
                            onChange={(e) => setStatus(e.target.value as "approved" | "rejected" | "compliance")}
                        >
                            <FormControlLabel value="approved" control={<Radio color="success" />} label="Approve" />
                            <FormControlLabel value="compliance" control={<Radio color="info" />} label="Compliance" />
                            <FormControlLabel value="rejected" control={<Radio color="error" />} label="Reject" />
                        </RadioGroup>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Add a comment *"
                        placeholder="Explain your decision..."
                        multiline
                        minRows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </Box>
            }
            dialogFooter={
                <Button
                    variant="contained"
                    color={status === "approved" ? "success" : status === "rejected" ? "error" : "info"}
                    onClick={handleSubmit}
                    disabled={!status || !comment.trim()}
                    sx={{ borderRadius: 3 }}
                >
                    {getButtonLabel()}
                </Button>
            }
        />
    );
};

export default NGOApproveRejectForm;
