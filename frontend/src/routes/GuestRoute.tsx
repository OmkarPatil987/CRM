import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../components/loader/LoaderText';
import { NAVIGATE_GUEST } from '../constant';
import GuestLayout from '../layout/GuestLayout';
import GuestProductDetail from '../pages/guest/product';
// import HomePage from '../pages/guest/home';
import { LegalPages } from '../pages/guest/home/footer/LeagalPage';
import { ContactSupport } from '../pages/guest/home/footer/ContactSupport';
import TermsOfService from '../pages/guest/home/footer/TermsOfService';
import HomePage from '../pages/guest/home';
// import HomePageApnaQR from '../pages/guest/home';


const Error404 = lazy(() => import('../pages/error/Error404'));

const GuestRoute = () => {
    return (
        <Suspense fallback={<GuestLayout><PageLoader /></GuestLayout>}>
            <Routes>
                <Route path='*' element={<GuestLayout> <Error404 /></GuestLayout>}></Route>
                <Route path={NAVIGATE_GUEST.HOME} element={<GuestLayout><HomePage /></GuestLayout>} />
                <Route path={"/privacy-policy"} element={<GuestLayout><LegalPages /></GuestLayout>} />
                <Route path={"/terms-of-service"} element={<GuestLayout><TermsOfService /></GuestLayout>} />
                <Route path={"/fco-guidelines"} element={<GuestLayout><LegalPages/></GuestLayout>} />
                <Route path={"/contact-support"} element={<GuestLayout><ContactSupport /></GuestLayout>} />
                <Route path={"/p/:uuid"} element={<GuestProductDetail />} />

                {/* <Route path={NAVIGATE_GUEST.VOLUNTAYREGISTER_PAGE} element={<GuestLayout><VoluntaryRegistrationPage /></GuestLayout>} />
                <Route path={NAVIGATE_GUEST.DONATION_FORM} element={<GuestLayout><DonationFormCard /></GuestLayout>} />             */}
            </Routes>
        </Suspense>
    )
}

export default GuestRoute;