import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiCallStateBase, ApiCallStatus } from '../../app/api';
import {
  ActionType,
  createFullActionType,
  serializeStoreError,
  StoreSliceName,
} from '../../store/constant-lib';
import { User, UserNoId } from '../account/types';
import { registerApi } from './usersApi';

export interface UserState extends ApiCallStateBase {
  user?: User;
}

const initialState: UserState = {
  status: ApiCallStatus.Idle,
};

export const register = createAsyncThunk<User, UserNoId>(
  createFullActionType(StoreSliceName.Users, ActionType.Register),
  (user: UserNoId) => {
    return registerApi(user);
  },
  {
    serializeError: serializeStoreError,
  }
);

const usersSlice = createSlice({
  name: StoreSliceName.Users,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(register.pending, (state) => {
        state.status = ApiCallStatus.Loading;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = ApiCallStatus.Idle;
        state.error = action.error;
        delete state.user;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = ApiCallStatus.Idle;
        state.user = action.payload;
        delete state.error;
      });
  },
});

export default usersSlice.reducer;
