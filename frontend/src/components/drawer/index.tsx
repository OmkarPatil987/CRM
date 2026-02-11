import { Suspense, useCallback, useMemo } from 'react';
import { Box, Button, Drawer, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Close } from '@mui/icons-material';

import type { RootState } from '../../redux/store';
import { closeDrawer } from '../../redux/reducer/drawerSlice';
import MapDrawerComponents from './MapDrawerComponents';
import PageLoader from '../loader/LoaderText';

const CommonDrawerComponent = () => {
    const dispatch = useDispatch();
    const { isFullScreen, drawerWidth, open, _Key } = useSelector((state: RootState) => state.drawer);
    const DrawerComponents = _Key ? MapDrawerComponents[_Key] : null;

    const DEFAULT_DRAWER_WIDTH = 1600;
    const drawerWidthMapping = useMemo(
        () => ({
            xl: 1400,
            lg: 1200,
            sm: 1000,
            md: 800,
        }),
        []
    );

    const getDrawerWidth = useCallback(() => {
        if (isFullScreen) return '100%';
        if (drawerWidth) return drawerWidthMapping[drawerWidth] || DEFAULT_DRAWER_WIDTH;
        return DEFAULT_DRAWER_WIDTH;
    }, [isFullScreen, drawerWidth, drawerWidthMapping]);

    return (
        <Drawer
            anchor="right"
            open={open}
            PaperProps={{
                sx: { maxWidth: getDrawerWidth(), width: '100%', boxShadow: 6, overflowY: 'unset', backgroundColor: 'background.paper', },
            }}
            slotProps={{
                backdrop: {
                    sx: { backdropFilter: 'blur(2px) sepia(8%)', backgroundColor: 'rgba(0, 0, 0, 0.51)', },
                },
            }}
        >
            <Box>
                {DrawerComponents ? (
                    <Suspense fallback={<PageLoader />}>
                        <DrawerComponents />
                    </Suspense>
                ) : (
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                        <Typography variant="h6" color="text.secondary" textAlign="center">
                            No component found for key: <strong>{_Key || 'undefined'}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            Please check your drawer configuration or mapping.
                        </Typography>
                        <Button
                            sx={{ borderRadius: 3 }}
                            variant="outlined"
                            color="error"
                            onClick={() => dispatch(closeDrawer())}
                            endIcon={<Close />}
                        >
                            Cancel
                        </Button>
                    </Box>
                )}
            </Box>
        </Drawer>
    );
};

export default CommonDrawerComponent;
