import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiCallStateBase, ApiCallStatus } from '../../app/api';
import { Order, OrderSeed, OrderUpdate } from '../../models/order';
import {
  ActionType,
  ActionWithPayload,
  createFullActionType,
  RootState,
  serializeStoreError,
  StoreSliceName,
} from '../../store/constant-lib';
import { createOrderApi, fetchOrdersApi, updateOrderApi } from './ordersApi';

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

export const updateOrder = createAsyncThunk(
  createFullActionType(StoreSliceName.Orders, ActionType.Update),
  (update: OrderUpdate) => updateOrderApi(update),
  {
    serializeError: serializeStoreError,
  }
);

export const createOrder = createAsyncThunk(
  createFullActionType(StoreSliceName.Orders, ActionType.Create),
  (order: OrderSeed) => createOrderApi(order),
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
      )

      .addCase(updateOrder.pending, (state) => {
        state.status = ApiCallStatus.Loading;
      })
      .addCase(updateOrder.fulfilled, (state) => {
        state.status = ApiCallStatus.Idle;
        delete state.error;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.status = ApiCallStatus.Idle;
        state.error = action.error;
      })

      .addCase(createOrder.pending, (state) => {
        state.status = ApiCallStatus.Loading;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.status = ApiCallStatus.Idle;
        delete state.error;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = ApiCallStatus.Idle;
        state.error = action.error;
      });
  },
});

export const { clear: clearOrders } = ordersSlice.actions;

export default ordersSlice.reducer;

export const selectOrders = (state: RootState) => state.orders.orders;
