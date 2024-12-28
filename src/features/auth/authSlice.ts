import { createSelector, createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser } from './authActions';
import { RootState } from '../../store';

interface AuthState {
    loading: boolean;
    userInfo: any;
    accessToken: string | null;
    error: unknown,
    success: boolean
};

const initialState: AuthState = {
    loading: false,
    userInfo: null,
    accessToken: null,
    error: null,
    success: false,
  }

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state: AuthState) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state: AuthState, { payload }) => {
            state.loading = false;
            state.userInfo = payload;
            state.accessToken = payload.accessToken;
        });
        builder.addCase(loginUser.rejected, (state: AuthState, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
        builder.addCase(registerUser.pending, (state: AuthState) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state: AuthState) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(registerUser.rejected, (state: AuthState, { error }) => {
            state.loading = false;
            state.error = error;
        });
    }
});

const getAuthState = (state: RootState) => state.auth;

const getAccessToken = createSelector(
    [getAuthState],
    (state) => state.accessToken
);

const getUserInfo = createSelector(
    [getAuthState],
    (state) => state.userInfo
);

export { getAccessToken, getUserInfo };

export default authSlice.reducer;