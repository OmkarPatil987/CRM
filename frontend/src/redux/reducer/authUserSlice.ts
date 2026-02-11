import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { decryptText } from '../../utils/utils';
import { AuthUserState } from '../../utils/dto/response/auth';

const auth = JSON.parse(decryptText(localStorage.getItem('user_auth_session')) || '{}');

const initialState: AuthUserState = {
	session_expires: auth.session_expires || null,
	token: auth.token || null,
	userDetails: auth.userDetails || null,
};

const authUserSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAuthUser: (state, action: PayloadAction<AuthUserState>) => {
			return { ...state, ...action.payload };
		},
		deleteAuthUser: () => ({
			session_expires: null,
			token: null,
			userDetails: null,
		}),
	},
});

export const { setAuthUser, deleteAuthUser } = authUserSlice.actions;
export default authUserSlice.reducer;
