import { Button, Typography } from "@mui/material";
import { useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setModuleRefresh } from "../../redux/reducer/refreshSlice";
import { showSnackbar } from "../../redux/reducer/snackbarSlice";
import { closeDialog } from "../../redux/reducer/dialogSlice";
import { CommonDeleteService } from "../../utils/services/product.service";
import GlobalDialogContent from "./GlobalDialogContent";
import { RootState } from "../../redux/store";





const CommonDeleteDialog = () => {
    const { payload } = useSelector((state: RootState) => state.dialog);
    const dispatch = useDispatch();

    console.log("payload in delete dialog", payload);

    const handleSubmit = useCallback(async () => {
        // const reqPayload = {
        //     id: payload?.data?.id
        // }
        const { code, data, message } = await CommonDeleteService(payload?.url, payload.request)

        if (code === 200) {
            dispatch(closeDialog());
            dispatch(showSnackbar({ message: message || 'Cost Category Deleted Successfully...!', type: "success" }));
            dispatch(setModuleRefresh({ moduleName: payload.refresh, refresh: true }));

        } else {
            dispatch(showSnackbar({ message: message || "error", type: "error" }));
        }


    }, [dispatch]);

    return (
        <GlobalDialogContent
            dialogBody={
                payload?.message || 'Are you sure you want to delete this item? This action cannot be undone.'
            }
            dialogFooter={
                <Button variant='contained' color='error' onClick={handleSubmit}>Delete</Button>
            }
        />

    );
};

export default CommonDeleteDialog;
