import { Color } from '@material-ui/lab';
import { createSlice, Draft } from '@reduxjs/toolkit';
import { Nullable } from '../../lib/types';
import {
  ActionType,
  ActionWithPayload,
  RootState,
  StoreSliceName,
} from '../../store/constant-lib';

export type StaticContent = string | JSX.Element;
export type ContentFactory = () => StaticContent;

export interface Snackbar {
  content: StaticContent | ContentFactory;
  severity: Color;
}
export type SnackbarState = Nullable<Snackbar>;

const initialState: SnackbarState = null;

const reducers = {
  [ActionType.Show](
    state: Draft<SnackbarState>,
    action: ActionWithPayload<Snackbar>
  ) {
    return action.payload;
  },
  [ActionType.Hide](state: Draft<SnackbarState>) {
    return null;
  },
};
const snackbarSlice = createSlice<
  SnackbarState,
  typeof reducers,
  StoreSliceName.Snackbar
>({
  name: StoreSliceName.Snackbar,
  initialState,
  reducers,
});

export const { show: showSnackbar, hide: hideSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;

export const selectSnackbar = (state: RootState) => state.snackbar;
