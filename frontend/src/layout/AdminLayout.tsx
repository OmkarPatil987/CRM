import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

import { isAuthorizedPage, isLoggedIn } from '../utils/utils';

import AdminTopBar from '../components/admin/topbar';
import AdminNavBar from '../components/admin/navbar';

import { Box } from '@mui/material';
import { Navigate } from 'react-router-dom';
import Error403 from '../pages/error/Error403';
import { NAVIGATE_AUTH } from '../constant';


const NAVBAR_WIDTH = 240;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const authUser = useSelector((state: RootState) => state.authUser);
    const userType = authUser?.userDetails?.user_type;

    if (!isLoggedIn(authUser)) {
        return <Navigate to={NAVIGATE_AUTH.LOGOUT_PAGE} replace />;
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Navigation Components */}
            <AdminTopBar />
            <AdminNavBar />

            {/* Main Content Area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    // mt accounts for TopBar height
                    mt: { xs: '60px', sm: '65px' },
                    // Ensure the width is constrained correctly
                    width: { md: `calc(100% - ${NAVBAR_WIDTH}px)` },
                    minHeight: 'calc(100vh - 65px)',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Authorization Wrapper */}
                <Box sx={{ flexGrow: 1, p: 0 }}>
                    {isAuthorizedPage(userType || '') ? children : <Error403 />}
                </Box>
            </Box>
        </Box>
    );
};

export default AdminLayout;
