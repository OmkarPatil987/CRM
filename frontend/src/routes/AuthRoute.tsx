import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../components/loader/LoaderText';
import { NAVIGATE_AUTH } from '../constant';
import AuthLayout from '../layout/AuthLayout';
import BlankLayout from '../layout/BlankLayout';
import GuestLayout from '../layout/GuestLayout';

const Error404 = lazy(() => import('../pages/error/Error404'));

const LoginPage = lazy(() => import('../pages/auth/login'));
const LogoutPage = lazy(() => import('../pages/auth/logout'));
const AuthRoute = () => {
    return (
        <Suspense fallback={<GuestLayout><PageLoader /></GuestLayout>}>
            <Routes>
                <Route path='*' element={<GuestLayout > <Error404 /></GuestLayout>}></Route>
                {/* <Route path={NAVIGATE_AUTH.LOGIN} element={<AuthLayout><LoginPage /></AuthLayout>}></Route> */}
                <Route path={NAVIGATE_AUTH.LOGIN} element={<LoginPage />}></Route>
                <Route path={NAVIGATE_AUTH.LOGOUT} element={<BlankLayout><LogoutPage /></BlankLayout>}></Route>
            </Routes>
        </Suspense>
    )
}

export default AuthRoute;