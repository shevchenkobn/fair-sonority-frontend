import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiCallStateBase, ApiCallStatus } from '../../app/api';
import { Order } from '../../models/order';
import {
  ActionType,
  ActionWithPayload,
  createFullActionType,
  serializeStoreError,
  StoreSliceName,
} from '../../store/constant-lib';
import { logout$ } from '../account/accountSlice';
import { fetchOrdersApi } from './ordersApi';

export interface OrderState extends ApiCallStateBase {
  orders?: Order[];
}

const initialState: OrderState = {
  status: ApiCallStatus.Idle,
};

export const fetchOrders = createAsyncThunk(
  createFullActionType(StoreSliceName.Orders, ActionType.Fetch),
  () => fetchOrdersApi(),
  {
    serializeError: serializeStoreError,
  }
);

const ordersSlice = createSlice({
  name: StoreSliceName.Orders,
  initialState,
  reducers: {
    [ActionType.Clear](state) {
      delete state.error;
      delete state.orders;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = ApiCallStatus.Loading;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = ApiCallStatus.Idle;
        state.error = action.error;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: ActionWithPayload<Order[]>) => {
          state.status = ApiCallStatus.Idle;
          state.orders = action.payload;
        }
      );
  },
});

export const { clear: clearOrders } = ordersSlice.actions;

export default ordersSlice.reducer;
