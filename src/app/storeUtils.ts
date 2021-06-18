import { AsyncThunkAction, miniSerializeError } from '@reduxjs/toolkit';
import { deserializeError } from 'serialize-error';
import { store } from './store';

export const serializeStoreError = miniSerializeError;
export function dispatchWithError<Returned>(
  action: AsyncThunkAction<Returned, any, Record<string, any>>
): Promise<Returned> {
  return store.dispatch(action).then((action) => {
    const error =
      action.meta &&
      'rejectedWithValue' in action.meta &&
      action.meta.rejectedWithValue
        ? action.payload
        : 'error' in action
        ? action.error
        : null;
    if (error) {
      throw deserializeError(error);
    }
    return action.payload as Returned;
  });
}
