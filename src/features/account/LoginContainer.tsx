import { Snackbar } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Alert } from '../../components/Alert';
import { store } from '../../store';
import { showSnackbar } from '../snackbar/snackbarSlice';
import { setTitle } from '../title/titlesSlice';
import { dispatchWithError } from '../../store/lib';
import { fetchAccount, login } from './accountSlice';
import { Login, LoginProps } from './Login';

export function LoginContainer() {
  useEffect(() => {
    store.dispatch(setTitle('Login'));
  }, []);

  const [errorMessage, setErrorMessage] = React.useState('');
  const handleErrorClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setErrorMessage('');
  };

  const handleCredentialsChange: LoginProps['onCredentialsChange'] = (
    credentials
  ) => {
    return dispatchWithError(login(credentials))
      .then(() => store.dispatch(fetchAccount()))
      .tapCatch((error) =>
        store.dispatch(
          showSnackbar({
            content: 'Login: ' + error.message,
            severity: 'error',
          })
        )
      ) as Promise<void>;
  };

  return <Login onCredentialsChange={handleCredentialsChange} />;
}
