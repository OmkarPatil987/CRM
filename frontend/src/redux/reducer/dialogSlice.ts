import { createSlice } from '@reduxjs/toolkit';

type DialogInitialValues = {
    isOpen: boolean
    type: string
    isFullScreen?: boolean
    status?: string
    payload?: any
    title: string,
    size: string
}

const initialState: DialogInitialValues = {
    isOpen: false, type: '', isFullScreen: false,  status: '', payload: null, title: '', size: '',
};

const dialogSlice = createSlice({
    name: 'dialog',
    initialState,
    reducers: {
        openDialog: (state, action) => {
            return { ...state, isOpen: true, ...action.payload }
        },
        closeDialog: (state) => {
            return { ...initialState }
        },
    },
});

export const { openDialog, closeDialog } = dialogSlice.actions;

export default dialogSlice.reducer;
