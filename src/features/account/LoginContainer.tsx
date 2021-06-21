import { Snackbar } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Alert } from '../../components/Alert';
import { store } from '../../store';
import { showSnackbar } from '../snackbar/snackbarSlice';
import { setTitle } from '../title/titlesSlice';
import { dispatchWithError } from '../../store/lib';
import { fetchAccount, login } from './accountSlice';
import { showLoginErrorSnackbar } from './lib';
import { Login, LoginProps } from './Login';

export function LoginContainer() {
  useEffect(() => {
    store.dispatch(setTitle('Login'));
  }, []);

  const handleCredentialsChange: LoginProps['onCredentialsChange'] = (
    credentials
  ) => {
    return dispatchWithError(login(credentials))
      .catch(showLoginErrorSnackbar)
      .then(() => undefined);
  };

  return <Login onCredentialsChange={handleCredentialsChange} />;
}
