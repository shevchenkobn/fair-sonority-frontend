import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Subject } from 'rxjs';
import { ApiCallStateBase, ApiCallStatus, hasAccessToken } from '../../app/api';
import { invalidState } from '../../app/constants';
import { User } from '../../models/user';
import {
  ActionType,
  createFullActionType,
  RootState,
  serializeStoreError,
  StoreSliceName,
} from '../../store/constant-lib';
import { fetchAccountApi, loginApi, logoutApi } from './accountApi';
import { Credentials } from './types';

export interface AccountState extends ApiCallStateBase {
  isLoggedIn: boolean;
  account?: User;
}

const initialState: AccountState = {
  status: ApiCallStatus.Idle,
  isLoggedIn: hasAccessToken(),
};

export const login = createAsyncThunk(
  createFullActionType(StoreSliceName.Account, ActionType.Login),
  (credentials: Credentials) => {
    return loginApi(credentials);
  },
  {
    serializeError: serializeStoreError,
  }
);

export const fetchAccount = createAsyncThunk(
  createFullActionType(StoreSliceName.Account, ActionType.Account),
  () => {
    return fetchAccountApi();
  },
  {
    serializeError: serializeStoreError,
  }
);

const accountSlice = createSlice({
  name: StoreSliceName.Account,
  initialState,
  reducers: {
    // login(state) {
    //   state.isLoggedIn = true;
    // },
    [ActionType.Logout](state) {
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
        state.status = ApiCallStatus.Loading;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = ApiCallStatus.Idle;
        state.isLoggedIn = false;
        state.error = action.error;
      })
      .addCase(login.fulfilled, (state) => {
        state.status = ApiCallStatus.Idle;
        state.isLoggedIn = true;
        delete state.error;
      })

      .addCase(fetchAccount.pending, (state) => {
        state.status = ApiCallStatus.Loading;
      })
      .addCase(fetchAccount.rejected, (state, action) => {
        state.status = ApiCallStatus.Idle;
        state.error = action.error;
        delete state.account;
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.status = ApiCallStatus.Idle;
        if (!state.isLoggedIn) {
          delete state.account;
          state.error = {
            name: invalidState,
            message: 'Cannot have account when not logged in!',
          };
        } else {
          delete state.error;
          state.account = action.payload;
        }
      });
  },
});

export const logout = () => {
  logoutApi();
  return accountSlice.actions.logout();
};

export default accountSlice.reducer;

export const selectAccountError = (state: RootState) => state.account.error;

export const selectAccount = (state: RootState) => state.account;

export const isLoggedIn = (state: RootState) => state.account.isLoggedIn;
