import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoaderText from '../components/loader/LoaderText';
import { NAVIGATE_ADMIN, NAVIGATE_AUTH, USER_TYPE } from '../constant';
import Error404 from '../pages/error/Error404';

import AdminRoute from './AdminRoute';
import AuthRoute from './AuthRoute';
import BlankLayout from '../layout/BlankLayout';
import { SettingsProvider } from '../providers/SettingsProvider';
import GuestRoute from './GuestRoute';

const AppRoute = () => {
    return (
        <Suspense fallback={<BlankLayout><LoaderText /></BlankLayout>}>
            <Routes>
                <Route path={`${USER_TYPE.GUEST}/*`} element={<GuestRoute />}></Route>
                <Route path={`${NAVIGATE_AUTH.AUTH}/*`} element={<AuthRoute />}></Route>
                <Route path={`${USER_TYPE.ADMIN}/*`} element={<SettingsProvider> <AdminRoute /></SettingsProvider>}></Route>
                <Route path={USER_TYPE.ADMIN} element={<Navigate to={NAVIGATE_ADMIN.DASHBOARD_PAGE} />}></Route>
                
                {[NAVIGATE_AUTH.LOGIN].map((path) => (
                    <Route key={path} path={path} element={<Navigate to={NAVIGATE_AUTH.LOGIN_PAGE} />} />
                ))}

                {[USER_TYPE.HOME, USER_TYPE.GUEST].map((path) => (
                    <Route key={path} path={path} element={<Navigate to={'/home'} />} />
                ))}
                <Route path='*' element={<Error404 />}></Route>
            </Routes>
        </Suspense>
    )
}

export default AppRoute;