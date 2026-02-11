import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteAuthUser } from '../../../redux/reducer/authUserSlice';
import { clearPermission } from '../../../redux/reducer/permissionSlice';

const LogoutPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        handleLogout();
    }, []);

    const handleLogout = async () => {
        localStorage.clear();
        sessionStorage.clear();
        dispatch(deleteAuthUser());
        dispatch(clearPermission())
        window.open("/auth/login", "_self");
    }
    return null;
};

export default LogoutPage;
