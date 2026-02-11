import { useCallback } from 'react';

import { DialogContent, DialogTitle, Box, Button, DialogActions, Typography, IconButton, SxProps } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { Close } from '@mui/icons-material';

import { closeDialog } from '../../redux/reducer/dialogSlice';
import { RootState } from '../../redux/store';
import { Theme } from '@emotion/react';

type GlobalDialogContentProps = {
    dialogBody: React.ReactNode;
    dialogFooter?: React.ReactNode;
    isShowDialogFooter?: boolean;
    dialogContentStyles?: SxProps<Theme>;
};

const GlobalDialogContent = ({ dialogBody, dialogFooter, isShowDialogFooter = true, dialogContentStyles = {} }: GlobalDialogContentProps) => {
    const dispatch = useDispatch();
    const { title, isFullScreen } = useSelector((state: RootState) => state.dialog);
    const handleClose = useCallback(() => { dispatch(closeDialog()); }, [dispatch]);

    return (
        <Box >
            {!isFullScreen && (
                <DialogTitle sx={{ borderRadius: '8px 8px 0 0', fontWeight: 'bold', fontSize: '24px', color: 'grey.800', borderBottom: '1px solid #e0e0e0', backgroundColor: '#f5f5f5', padding: '10px', position: "sticky", zIndex: "99", top: "0" }} >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h5" sx={{ fontWeight: '600', color: '#333' }}>{title ?? "-"}</Typography>
                        <IconButton size="small" onClick={handleClose}>
                            <Close sx={{ fontSize: 24, color: 'grey.700', transition: 'color 0.3s', '&:hover': { color: 'red' } }} />
                        </IconButton>
                    </Box>
                </DialogTitle>
            )}

            <DialogContent sx={{ overflow: 'auto', maxHeight: "40rem", padding: "16px", paddingTop: "15px !important", ...dialogContentStyles }}>
                {dialogBody}
            </DialogContent>
            {isShowDialogFooter && (
                <DialogActions sx={{ borderRadius: '0 0 8px 8px', px: 2, py: 1, bottom: "0", left: "0", right: "0", borderTop: '1px solid #e0e0e0', position: "sticky", zIndex: "99" }}>
                    <Button sx={{ borderRadius: 3 }} variant="outlined" color='error' onClick={handleClose} endIcon={<Close />}>Cancel</Button>
                    {dialogFooter}
                </DialogActions>
            )}
        </Box>
    )
}
export default GlobalDialogContent; 
