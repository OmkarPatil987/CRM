import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Assuming Dayjs is used elsewhere, but not directly in this simplified slice.
// import { Dayjs } from 'dayjs';

interface CommonFilterState {
    searchTerm: string;
    district_id: number | null;
    taluka_id: number | null;
    village_id: number | null;
}

const initialState: CommonFilterState = {
    searchTerm: '',
    district_id: null,
    taluka_id: null,
    village_id: null,
};

const commonFilterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setSearchTerm(state, action: PayloadAction<string>) {
            state.searchTerm = action.payload;
        },
        setDistrictId(state, action: PayloadAction<number | null>) {
            state.district_id = action.payload;
            // When district changes, reset taluka and village
            state.taluka_id = null;
            state.village_id = null;
        },
        setTalukaId(state, action: PayloadAction<number | null>) {
            state.taluka_id = action.payload;
            // When taluka changes, reset village
            state.village_id = null;
        },
        setVillageId(state, action: PayloadAction<number | null>) {
            state.village_id = action.payload;
        },
        clearFilters(state) {
            state.searchTerm = '';
            state.district_id = null;
            state.taluka_id = null;
            state.village_id = null;
        },
    },
});

export const {
    setSearchTerm,
    setDistrictId,
    setTalukaId,
    setVillageId,
    clearFilters,
} = commonFilterSlice.actions;

export default commonFilterSlice.reducer;
