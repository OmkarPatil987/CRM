import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type DrawerWidthOptions = "xl" | "lg" | "md" | "sm" ;

type DrawerInitialValues = {
    uuid: string;
    _Key: string;
    tab: string;
    open: boolean;
    drawerData: any;
    isFullScreen?: boolean;
    drawerWidth?: DrawerWidthOptions;
    payload?: any;
    title?: string;
};

const initialState: DrawerInitialValues = {
    uuid: '',
    _Key: '',
    tab: '',
    open: false,
    drawerData: {},
    title: '',
    isFullScreen: false,
    drawerWidth: "xl",
};

const drawerSlice = createSlice({
    name: 'drawer',
    initialState,
    reducers: {
        openDrawer: (state, action: PayloadAction<Partial<DrawerInitialValues>>) => {
            return { ...state, open: true, ...action.payload };
        },
        closeDrawer: (state) => {
            return { ...initialState };
        },
        setOpen: (state, action: PayloadAction<boolean>) => {
            state.open = action.payload;
        },
    },
});

export const { openDrawer, closeDrawer, setOpen } = drawerSlice.actions;

export default drawerSlice.reducer;
