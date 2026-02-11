import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type SnackbarState = {
  messages: {
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }[];
}

const initialState: SnackbarState = {
  messages: []
};

let nextId = 1;

const snackbarMessageSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'warning' | 'info' }>) => {
      state.messages.push({ id: ++nextId, ...action.payload });
    },
    hideSnackbar: (state, action: PayloadAction<number>) => {
      state.messages = state.messages.filter((snackbar) => snackbar.id !== action.payload);
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarMessageSlice.actions;

export default snackbarMessageSlice.reducer;