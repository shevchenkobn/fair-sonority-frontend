import {
  createAsyncThunk,
  createSlice,
  SerializedError,
} from '@reduxjs/toolkit';
import { ApiCallState, hasAccessToken } from '../../app/api';
import { invalidState } from '../../app/constants';
import { RootState } from '../../app/store';
import { User } from '../../models/user';
import { fetchAccountApi, loginApi, logoutApi } from './accountApi';

export interface AccountState {
  status: ApiCallState;
  isLoggedIn: boolean;
  account?: User;
  error?: SerializedError;
}

const initialState: AccountState = {
  status: ApiCallState.Idle,
  isLoggedIn: hasAccessToken(),
};

export const login = createAsyncThunk('account/login', () => {
  return loginApi;
});

export const fetchAccount = createAsyncThunk('account/self', () => {
  return fetchAccountApi;
});

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    loginAction(state) {
      state.isLoggedIn = true;
    },
    logoutAction(state) {
      state.isLoggedIn = false;
    },
    accountFetch(state, action) {
      if (!state.isLoggedIn) {
        delete state.account;
        state.error = {
          name: invalidState,
          message: 'Cannot have account when not logged in!',
        };
      } else {
        state.account = action.payload;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.status = ApiCallState.Loading;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = ApiCallState.Idle;
        state.isLoggedIn = false;
        state.error = action.error;
      })
      .addCase(login.fulfilled, (state) => {
        state.status = ApiCallState.Idle;
      })

      .addCase(fetchAccount.pending, (state) => {
        state.status = ApiCallState.Loading;
      })
      .addCase(fetchAccount.rejected, (state, action) => {
        state.status = ApiCallState.Idle;
        state.error = action.error;
      })
      .addCase(fetchAccount.fulfilled, (state) => {
        state.status = ApiCallState.Idle;
      });
  },
});

export const logout = () => {
  logoutApi();
  return accountSlice.actions.logoutAction();
};

export const { logoutAction, loginAction, accountFetch } = accountSlice.actions;

export default accountSlice.reducer;

export const isLoggedIn = (state: RootState) => state.account.isLoggedIn;
