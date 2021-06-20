import { configureStore } from '@reduxjs/toolkit';
import { Subject } from 'rxjs';
import { logger } from '../app/logger';
import accountReducer from '../features/account/accountSlice';
import titlesSlice from '../features/title/titlesSlice';
import { Nullable } from '../lib/types';
import { RootState, StoreSliceName } from './constant-lib';

export const store = configureStore({
  reducer: {
    [StoreSliceName.Account]: accountReducer,
    [StoreSliceName.Titles]: titlesSlice,
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
