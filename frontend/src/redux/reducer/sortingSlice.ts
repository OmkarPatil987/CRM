import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SortingState {
    orderBy: string;
    order: "asc" | "desc";
    refresh: boolean;
}

const initialState: SortingState = {
    orderBy: "created_at",
    order: "desc",
    refresh: false,
};

const sortingSlice = createSlice({
    name: "sorting",
    initialState,
    reducers: {
        setSorting: (state, action: PayloadAction<{ orderBy: string; order: "asc" | "desc" }>) => {
            state.orderBy = action.payload.orderBy;
            state.order = action.payload.order;
        },
        clearSorting: (state) => {
            Object.assign(state, initialState); 
        },        
        setRefresh: (state, action: PayloadAction<boolean>) => {
            state.refresh = action.payload;
        },
    },
});

export const { setSorting, clearSorting, setRefresh } = sortingSlice.actions;
export default sortingSlice.reducer;
