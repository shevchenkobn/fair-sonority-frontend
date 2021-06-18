import {
  createAsyncThunk,
  createSlice,
  SerializedError,
} from '@reduxjs/toolkit';
import { ApiCallState, hasAccessToken } from '../../app/api';
import { invalidState } from '../../app/constants';
import { RootState } from '../../app/store';
import { serializeStoreError } from '../../app/storeUtils';
import { Me } from '../../models/user';
import { fetchAccountApi, loginApi, logoutApi } from './accountApi';
import { Credentials } from './types';

export interface AccountState {
  status: ApiCallState;
  isLoggedIn: boolean;
  account?: Me;
  error?: SerializedError;
}

const initialState: AccountState = {
  status: ApiCallState.Idle,
  isLoggedIn: hasAccessToken(),
};

export const login = createAsyncThunk(
  'account/login',
  (credentials: Credentials) => {
    return loginApi(credentials);
  },
  {
    serializeError: serializeStoreError,
  }
);

export const fetchAccount = createAsyncThunk(
  'account/self',
  () => {
    return fetchAccountApi();
  },
  {
    serializeError: serializeStoreError,
  }
);

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    // login(state) {
    //   state.isLoggedIn = true;
    // },
    logout(state) {
      state.isLoggedIn = false;
    },
    // self(state, action) {
    //   if (!state.isLoggedIn) {
    //     delete state.account;
    //     state.error = {
    //       name: invalidState,
    //       message: 'Cannot have account when not logged in!',
    //     };
    //   } else {
    //     state.account = action.payload;
    //   }
    // },
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
        state.isLoggedIn = true;
      })

      .addCase(fetchAccount.pending, (state) => {
        state.status = ApiCallState.Loading;
      })
      .addCase(fetchAccount.rejected, (state, action) => {
        state.status = ApiCallState.Idle;
        state.error = action.error;
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.status = ApiCallState.Idle;
        if (!state.isLoggedIn) {
          delete state.account;
          state.error = {
            name: invalidState,
            message: 'Cannot have account when not logged in!',
          };
        } else {
          state.account = action.payload;
        }
      });
  },
});

export const performLogout = () => {
  logoutApi();
  return accountSlice.actions.logout();
};

export const { logout } = accountSlice.actions;

export default accountSlice.reducer;

export const selectAccountError = (state: RootState) => state.account.error;

export const selectAccount = (state: RootState) => state.account;

export const isLoggedIn = (state: RootState) => state.account.isLoggedIn;
