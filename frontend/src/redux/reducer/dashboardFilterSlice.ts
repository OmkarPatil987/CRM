import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
    selectedDistrict: string | null;
    selectedTaluka: string | null;
    selectedYear: number | null;
}

const getInitialState = (): LocationState => ({
    selectedDistrict: null,
    selectedTaluka: null,
    selectedYear: null,
});

const dashboardFilterSlice = createSlice({
    name: "dashboardFilter",
    initialState: getInitialState(),
    reducers: {
        setSelectedDistrict(state, action: PayloadAction<string | null>) {
            state.selectedDistrict = action.payload;
        },
        setSelectedTaluka(state, action: PayloadAction<string | null>) {
            state.selectedTaluka = action.payload;
        },
        setSelectedYear(state, action: PayloadAction<number | null>) {
            state.selectedYear = action.payload;
        },
        clearFilters() {
            return getInitialState();
        },
    },
});

export const {
    setSelectedDistrict,
    setSelectedTaluka,
    setSelectedYear,
    clearFilters,
} = dashboardFilterSlice.actions;

export default dashboardFilterSlice.reducer;
