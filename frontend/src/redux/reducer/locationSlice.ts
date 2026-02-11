import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface ProjectLocationState {
    CreateProjectlocation: Record<string, any>; 
}


const initialState: ProjectLocationState = {
    CreateProjectlocation: {},
};

const locationSlice = createSlice({
    name: "projectLocation",
    initialState,
    reducers: {
        setProjectLocation: (state, action: PayloadAction<Record<string, any>>) => {
            state.CreateProjectlocation = action.payload;
        },
        resetProjectLocation: (state) => {
            state.CreateProjectlocation = {};
        },
    },
});

export const { setProjectLocation, resetProjectLocation } = locationSlice.actions;
export default locationSlice.reducer;