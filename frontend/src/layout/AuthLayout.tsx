import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

import { RootState } from '../redux/store';
import { isLoggedIn } from '../utils/utils';
import { NAVIGATE_ADMIN, NAVIGATE_AUTH } from '../constant';

import RegisterTopbar from '../components/admin/topbar/RegisterTopbar';
import Footer from '../components/admin/footer';

interface AuthLayoutProps {
    children: React.ReactNode;
}
const AuthUserType: string[] = ["volunteer", "district_coordinator", "taluka_coordinator", "admin"]
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    const authUser = useSelector((state: RootState) => state.authUser);
    if (isLoggedIn(authUser)) {
        const userType = authUser?.userDetails?.user_type;
        if (AuthUserType.includes(userType || '')) {
            if (userType === "volunteer") {
                return <Navigate to={'/admin/flood-condition-records'} replace />;
            }
            else {
                return <Navigate to={NAVIGATE_ADMIN.DASHBOARD_PAGE} replace />;
            }
        } else {
            console.warn('AuthLayout: User is logged in but user_type is invalid. Clearing session and redirecting to login.');
            localStorage.removeItem('user_auth_session');
            return <Navigate to={NAVIGATE_AUTH.LOGOUT_PAGE} replace />;
        }
    }
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                minHeight: '100vh',
                minWidth: '290px',
                height: 'auto',
            }}
        >
            <RegisterTopbar />
            <Box sx={{ flex: 1, display: 'flex', width: '100%' }}>
                {children}
            </Box>
            <Footer />
        </Box>
    );
};

export default AuthLayout;
