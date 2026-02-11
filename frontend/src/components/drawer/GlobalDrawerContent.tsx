import React, { useCallback } from 'react';
import { Box, Button, SxProps, useTheme } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../redux/store';
import { closeDrawer } from '../../redux/reducer/drawerSlice';
import ResponsiveEllipsisTitle from '../common/ResponsiveEllipsisTitle';
import { Theme } from '@emotion/react';

type GlobalDrawerContentProps = {
    drawerBody: React.ReactNode;
    drawerFooter?: React.ReactNode;
    isShowDrawerFooter?: boolean;
    DrawerContentStyles?: SxProps<Theme>;
};

const GlobalDrawerContent: React.FC<GlobalDrawerContentProps> = ({ drawerBody, drawerFooter, isShowDrawerFooter = true, DrawerContentStyles = {}, }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { title } = useSelector((state: RootState) => state.drawer);

    const handleClose = useCallback(() => {
        dispatch(closeDrawer());
    }, [dispatch]);

    return (
        <Box>
            <Box sx={{ bgcolor: 'primary.main', color: 'white', px: 2, height: 55, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 4, zIndex: 2, }} >
                <ResponsiveEllipsisTitle title={title || ''} color="white" />
                <Button onClick={handleClose} variant="contained" color="error" endIcon={<Close />} sx={{ borderRadius: 3 }} > Close </Button>
            </Box>
            <Box sx={{ backgroundColor: 'background.default', display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 59px)', maxHeight: 'calc(100vh - 59px)', ...DrawerContentStyles, }}>
                    <Box sx={{ flex: '1 1', overflowY: 'auto', py: 1.5 }}>
                        {drawerBody}
                    </Box>
                    {isShowDrawerFooter && (
                        <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, px: 2, py: 1, bgcolor: 'grey.100', position: 'sticky', bottom: 0, zIndex: 2, display: 'flex', justifyContent: 'flex-end', gap: 1.5, }} >
                            <Button variant="outlined" color="error" onClick={handleClose} endIcon={<Close />} sx={{ borderRadius: 3 }} > Cancel </Button>
                            {drawerFooter}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default GlobalDrawerContent;
