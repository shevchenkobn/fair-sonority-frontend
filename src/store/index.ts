import { configureStore } from '@reduxjs/toolkit';
import { Subject } from 'rxjs';
import { logger } from '../app/logger';
import accountReducer from '../features/account/accountSlice';
import ordersSlice from '../features/orders/ordersSlice';
import snackbarSlice from '../features/snackbar/snackbarSlice';
import titlesSlice from '../features/title/titlesSlice';
import usersSlice from '../features/users/usersSlice';
import { Nullable } from '../lib/types';
import { RootState, StoreSliceName } from './constant-lib';

export const store = configureStore({
  reducer: {
    [StoreSliceName.Account]: accountReducer,
    [StoreSliceName.Titles]: titlesSlice,
    [StoreSliceName.Snackbar]: snackbarSlice,
    [StoreSliceName.Orders]: ordersSlice,
    [StoreSliceName.Users]: usersSlice,
  },
});

let subject: Nullable<Subject<RootState>> = null;
export function getState$() {
  if (!subject) {
    subject = new Subject();
    store.subscribe(() => {
      if (subject) {
        subject.next(store.getState());
      } else {
        logger.error('State subject is not present!');
      }
    });
  }
  return subject.asObservable();
}
