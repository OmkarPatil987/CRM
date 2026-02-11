import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LanguageState {
    language: 'english' | 'marathi';
}

const storedLanguage = sessionStorage.getItem("language") as 'english' | 'marathi' | null;
const initialState: LanguageState = {
    language: storedLanguage || 'english',
};

const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<'english' | 'marathi'>) => {
            state.language = action.payload;
            sessionStorage.setItem("language", action.payload);
        },
    },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
