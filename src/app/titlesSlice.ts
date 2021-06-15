import { createSlice } from '@reduxjs/toolkit';
import { ActionWithPayload, RootState } from './store';

export interface TitleState {
  documentTitle: string;
  appBarTitle: string;
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
  appBarTitle: defaultTitle,
};

const titlesSlice = createSlice({
  name: 'titles',
  initialState,
  reducers: {
    setTitle(state, action: ActionWithPayload<string>) {
      state.appBarTitle = formatAppBarTitle(action.payload);
      state.documentTitle = formatDocumentTitle(action.payload);
    },
  },
});

export const { setTitle } = titlesSlice.actions;

export default titlesSlice.reducer;

export const selectAppBarTitle = (state: RootState) => state.titles.appBarTitle;
export const selectDocumentTitle = (state: RootState) =>
  state.titles.documentTitle;
