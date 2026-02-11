import { createSlice } from '@reduxjs/toolkit';

interface Permission {
    permissions: any;
    navigateTabsArray: Array<object>;
    nestedPermissionsData: Array<object>;
    getFilterPermissionsObject: any;
}

const initialState: Permission = {
    permissions: "",
    navigateTabsArray: [],
    nestedPermissionsData: [],
    getFilterPermissionsObject: {},
};

const modalSlice = createSlice({
    name: 'permissions',
    initialState,
    reducers: {
        setPermission: (state, action) => {
            return { ...state, ...action.payload };
        },
        clearPermission: () => {
            return initialState;
        },
    },
});

export const { setPermission, clearPermission } = modalSlice.actions;
export default modalSlice.reducer;
