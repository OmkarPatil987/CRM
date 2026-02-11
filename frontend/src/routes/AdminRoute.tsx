import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import LoaderText from '../components/loader/LoaderText';
import Error404 from '../pages/error/Error404';
import AdminLayout from '../layout/AdminLayout';
import { NAVIGATE_ADMIN } from '../constant';
import ProductForm from '../pages/admin/products/Components/CreateProduct';
import ProductDetail from '../pages/admin/products/Components/ProductDetails';
// import ProductList from '../pages/admin/products/ProductList';
import UserListPage from '../pages/admin/users';
import CompanyList from '../pages/admin/companies';
import ProductList from '../pages/admin/products/Master/ProductList';
import QRList from '../pages/admin/qr/StaticList';
import QRForm from '../pages/admin/qr/QRGenerate';
import QRListDynamic from '../pages/admin/qr/DynamicQr';
import CompanyForm from '../pages/admin/companies/CreateCompnay';
import DashboardPage from '../pages/admin/dashboard';
import LeadListPage from '../pages/admin/leads';
import LeadDetailsPage from '../pages/admin/leads/LeadDetails';
import LeadCreatePage from '../pages/admin/leads/LeadCreate';
import ContactListPage from '../pages/admin/contacts';
import ContactDetailsPage from '../pages/admin/contacts/ContactDetails';
import DealsPipelinePage from '../pages/admin/deals';
import ActivitiesPage from '../pages/admin/activities';
import ReportsPage from '../pages/admin/reports';
import DealDetailsPage from '../pages/admin/deals/DealDetails';
import ActivityDetailsPage from '../pages/admin/activities/ActivityDetails';


// const DashboardPage = lazy(() => import('../pages/admin/dashboard'))


const AdminRoute = () => {
    return (
        <Suspense fallback={<AdminLayout><LoaderText /></AdminLayout>}>
            <AdminLayout>
                <Routes>
                    <Route path='*' element={<Error404 />} />
                    <Route path={NAVIGATE_ADMIN.DASHBAORD} element={<DashboardPage />} />
                    <Route path={NAVIGATE_ADMIN.LEADS} element={<LeadListPage />} />
                    <Route path={NAVIGATE_ADMIN.LEAD_CREATE} element={<LeadCreatePage />} />
                    <Route path={NAVIGATE_ADMIN.LEAD_DETAILS} element={<LeadDetailsPage />} />
                    <Route path={NAVIGATE_ADMIN.CONTACTS} element={<ContactListPage />} />
                    <Route path={NAVIGATE_ADMIN.CONTACT_DETAILS} element={<ContactDetailsPage />} />
                    <Route path={NAVIGATE_ADMIN.DEALS_PIPELINE} element={<DealsPipelinePage />} />
                    <Route path={NAVIGATE_ADMIN.DEAL_DETAILS} element={<DealDetailsPage />} />
                    <Route path={NAVIGATE_ADMIN.ACTIVITIES} element={<ActivitiesPage />} />
                    <Route path={NAVIGATE_ADMIN.ACTIVITY_DETAILS} element={<ActivityDetailsPage />} />
                    <Route path={NAVIGATE_ADMIN.REPORTS} element={<ReportsPage />} />
                    <Route path={NAVIGATE_ADMIN.PRODUCT} element={<ProductList />} />
                    <Route path={NAVIGATE_ADMIN.PRODUCT_CREATE} element={<ProductForm />} />
                    <Route path={NAVIGATE_ADMIN.PRODUCT_DETAILS} element={<ProductDetail />} />
                    <Route path={NAVIGATE_ADMIN.CAMPANIES} element={<CompanyList />} />
                    <Route path={NAVIGATE_ADMIN.CAMPANIES_CREATE} element={<CompanyForm />} />
                    <Route path={NAVIGATE_ADMIN.QR_STATIC} element={<QRList />} />
                    <Route path={NAVIGATE_ADMIN.QR_DYNAMIC} element={<QRListDynamic />} />
                    <Route path={NAVIGATE_ADMIN.QR_CREATE} element={<QRForm />} />
                    <Route
                        path={NAVIGATE_ADMIN.USERS}
                        element={<UserListPage />}
                    />
                    {/* <Route path={NAVIGATE_ADMIN.STATASTICS} element={<Statastics />} /> */}
                </Routes>
            </AdminLayout>
        </Suspense>
    );
};

export default AdminRoute;
