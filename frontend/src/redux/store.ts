import { configureStore } from '@reduxjs/toolkit';
import snackbarReducer from './reducer/snackbarSlice';
import authUserReducer from './reducer/authUserSlice';
import drawerReducer from './reducer/drawerSlice';
import dialogReducer from './reducer/dialogSlice';
import modalReducer from './reducer/modalSlice'
import permissionReducers from './reducer/permissionSlice';
import sortingReducer from "./reducer/sortingSlice";
import LanguageReducer from "./reducer/languageSlice";
import LocationReducer from "./reducer/locationSlice";
import refreshReducer from "./reducer/refreshSlice";
import ngoFormDataReducer from './reducer/ngoFormData';
import registerOtpVerifyReducer from './reducer/regMailVerifySlice';
import dashboardFilterReducer from "./reducer/dashboardFilterSlice"
import commonFilterReducer from "./reducer/CommonFilterSlice"

const store = configureStore({
    reducer: {
        snackbar: snackbarReducer,
        authUser: authUserReducer,
        drawer: drawerReducer,
        dialog: dialogReducer,
        modal: modalReducer,
        permission: permissionReducers,
        sorting: sortingReducer,
        language: LanguageReducer,
        location: LocationReducer,
        refresh: refreshReducer,
        ngoFormData:ngoFormDataReducer,
        registerMailVerify: registerOtpVerifyReducer,
        dashboardFilter: dashboardFilterReducer,
        filters: commonFilterReducer,

    }
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof import('./store').default.getState>

export default store;