import { createSlice } from '@reduxjs/toolkit';
import {
  ActionWithPayload,
  RootState,
  StoreSliceName,
} from '../../store/constant-lib';

export interface TitleState {
  documentTitle: string;
  appTitle: string;
}

export const projectName = 'FairSonority';
export const defaultTitle = projectName;

export function formatDocumentTitle(title: string) {
  if (!title) {
    return defaultTitle;
  }
  return `${title} - ${projectName}`;
}
export function formatAppBarTitle(title: string) {
  if (!title) {
    return defaultTitle;
  }
  return `${projectName}: ${title}`;
}

const initialState: TitleState = {
  documentTitle: defaultTitle,
  appTitle: defaultTitle,
};

const titlesSlice = createSlice({
  name: StoreSliceName.Titles,
  initialState,
  reducers: {
    setTitle(state, action: ActionWithPayload<string>) {
      const appBarTitle = formatAppBarTitle(action.payload);
      if (state.appTitle !== appBarTitle) {
        state.appTitle = appBarTitle;
      }
      const documentTitle = formatDocumentTitle(action.payload);
      if (state.documentTitle !== documentTitle) {
        state.documentTitle = documentTitle;
      }
    },
  },
});

export const { setTitle } = titlesSlice.actions;

export default titlesSlice.reducer;

export const selectAppTitle = (state: RootState) => state.titles.appTitle;
export const selectDocumentTitle = (state: RootState) =>
  state.titles.documentTitle;
