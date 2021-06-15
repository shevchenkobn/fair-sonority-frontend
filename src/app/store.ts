import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { Subject } from 'rxjs';
import accountReducer from '../features/account/accountSlice';
import { Nullable } from '../lib/types';
import { logger } from './logger';
import titlesSlice from './titlesSlice';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    titles: titlesSlice,
  },
});

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
