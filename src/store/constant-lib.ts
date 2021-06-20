/**
 * File for lib things that don't depend on store or import it as type only.
 */
import { Action, miniSerializeError, ThunkAction } from '@reduxjs/toolkit';
import { store } from './index';

export const serializeStoreError = miniSerializeError;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export interface ActionWithPayload<T> extends Action<string> {
  payload: T;
}

export enum ActionType {
  Login = 'login',
  Account = 'account',
  Logout = 'logout',
}

export enum StoreSliceName {
  Account = 'account',
  Titles = 'titles',
}

export function createFullActionType(
  sliceName: StoreSliceName,
  action: ActionType
) {
  return `${sliceName}/${action}`;
}
