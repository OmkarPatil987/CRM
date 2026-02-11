import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MailVerificationState {
    isMailVerified?: boolean
    optnumber?: string
    email?: string
    resend?: boolean
}

// Initial state
const initialState: MailVerificationState = {
    isMailVerified: false,
    optnumber: '',
    email: '',
    resend: false
};

// Create Redux slice
const mailVerificationSlice = createSlice({
    name: "mailVerification",
    initialState,
    reducers: {
        setMailVerified: (state, action: PayloadAction<{ isMailVerified?: boolean; optnumber?: string, email?: string, resend?: boolean }>) => {
            state.isMailVerified = action.payload.isMailVerified;
            state.optnumber = action.payload.optnumber;
            state.email = action.payload.email;
            state.resend = action.payload.resend
        },
        resetMailVerification: (state) => {
            state.isMailVerified = false;
            state.optnumber = '';
            state.email = '';
            state.resend = false
        },
    },
});

// Export actions
export const { setMailVerified, resetMailVerification } = mailVerificationSlice.actions;
export default mailVerificationSlice.reducer;
