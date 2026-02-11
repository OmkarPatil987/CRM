import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    AppBar, Box, Toolbar, IconButton, Typography, MenuItem, Menu,
    Tooltip, Avatar, Divider, useTheme, Badge, Stack, ButtonBase, alpha
} from '@mui/material';

// Professional Lucide Icons
import {
    Menu as LucideMenu,
    Bell,
    Maximize,
    Minimize,
    LogOut,
    User,
    LifeBuoy,
    Settings
} from 'lucide-react';

import { RootState } from '../../../redux/store';
import { useSettings } from '../../../providers/SettingsProvider';
import { NAVIGATE_AUTH } from '../../../constant';
import useResponsive from '../../../hooks/useResponsive';
import { showSnackbar } from '../../../redux/reducer/snackbarSlice';

export default function AdminTopBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const { isDesktop, isMobile } = useResponsive();

    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const authUser = useSelector((state: RootState) => state.authUser);
    const { setIsDashboardDrawerOpened } = useSettings();

    const isMenuOpen = Boolean(anchorEl);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleLogout = () => navigate(NAVIGATE_AUTH.LOGOUT_PAGE);

    const formatUserType = (userType?: string) => {
        if (!userType) return "Admin";
        return userType.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                backgroundColor: alpha('#fff', 0.8),
                backdropFilter: 'blur(12px)',
                borderBottom: `1px solid ${theme.palette.divider}`,
                color: 'text.primary',
                // zIndex: theme.zIndex.drawer + 1
            }}
        >
            <Toolbar sx={{ height: 64, justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
                {/* Left Side */}
                <Stack direction="row" alignItems="center" spacing={2}>
                    <IconButton
                        onClick={() => setIsDashboardDrawerOpened()}
                        sx={{
                            color: 'primary.main',
                            borderRadius: '10px',
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.12) }
                        }}
                    >
                        <LucideMenu size={20} />
                    </IconButton>

                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>
                            Sales CRM <Box component="span" sx={{ color: 'primary.main' }}>Admin</Box>
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                            Pipeline & customer management
                        </Typography>
                    </Box>
                </Stack>

                {/* Right Side Actions */}
                <Stack direction="row" alignItems="center" spacing={1}>
                    {isDesktop && (
                        <>
                            <Tooltip title="Support">
                                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                                    <LifeBuoy size={20} strokeWidth={1.5} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Fullscreen">
                                <IconButton size="small" onClick={toggleFullscreen} sx={{ color: 'text.secondary' }}>
                                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                                </IconButton>
                            </Tooltip>
                            <IconButton size="small" sx={{ color: 'text.secondary' }}>
                                <Badge variant="dot" color="error">
                                    <Bell size={20} strokeWidth={1.5} />
                                </Badge>
                            </IconButton>
                        </>
                    )}

                    <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: 'center' }} />

                    <ButtonBase
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        sx={{ borderRadius: '12px', p: 0.5, transition: '0.2s', '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.05) } }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 1 }}>
                            {!isMobile && (
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1 }}>
                                        {authUser.userDetails?.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.65rem' }}>
                                        {formatUserType(authUser?.userDetails?.user_type)}
                                    </Typography>
                                </Box>
                            )}
                            <Avatar
                                sx={{
                                    width: 38, height: 38, bgcolor: 'primary.main', fontWeight: 700, fontSize: '0.9rem',
                                    border: `2px solid #fff`, boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                }}
                            >
                                {authUser.userDetails?.name?.charAt(0).toUpperCase()}
                            </Avatar>
                        </Stack>
                    </ButtonBase>
                </Stack>
            </Toolbar>

            {/* Profile Menu */}
            <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                    elevation: 0,
                    sx: { mt: 1.5, borderRadius: '12px', minWidth: 200, filter: 'drop-shadow(0px 5px 15px rgba(0,0,0,0.1))', border: '1px solid', borderColor: 'divider' }
                }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <MenuItem onClick={() => setAnchorEl(null)} sx={{ py: 1.5 }}>
                    <User size={16} style={{ marginRight: '12px' }} /> Profile
                </MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)} sx={{ py: 1.5 }}>
                    <Settings size={16} style={{ marginRight: '12px' }} /> Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main', fontWeight: 600 }}>
                    <LogOut size={16} style={{ marginRight: '12px' }} /> Logout
                </MenuItem>
            </Menu>
        </AppBar>
    );
}
