import './polyfills';
import {
  createMuiTheme,
  MuiThemeProvider,
  unstable_createMuiStrictModeTheme,
} from '@material-ui/core';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { Provider } from 'react-redux';
import App from './App';
import { isNotProduction } from './lib/config';
import { store } from './store';
import reportWebVitals from './reportWebVitals';

const theme = (
  isNotProduction() ? unstable_createMuiStrictModeTheme : createMuiTheme
)();

ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
