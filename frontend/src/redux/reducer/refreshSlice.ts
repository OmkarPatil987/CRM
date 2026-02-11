import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface RefreshState {
    [moduleName: string]: boolean;
}

const initialState: RefreshState = {};

const refreshSlice = createSlice({
    name: 'refresh',
    initialState,
    reducers: {

        setModuleRefresh(state, action: PayloadAction<{ moduleName: string; refresh: boolean }>) {
            const { moduleName, refresh } = action.payload;
            state[moduleName] = refresh;
        },
        clearModuleRefresh(state, action: PayloadAction<{ moduleName: string }>) {
            const { moduleName } = action.payload;
            delete state[moduleName];
        },

        resetRefresh() {
            return {};
        }
    }
});

export const { setModuleRefresh, clearModuleRefresh, resetRefresh } = refreshSlice.actions;
export default refreshSlice.reducer;
