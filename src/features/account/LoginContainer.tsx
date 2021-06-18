import { Snackbar } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Alert } from '../../app/Alert';
import { store } from '../../app/store';
import { dispatchWithError } from '../../app/storeUtils';
import { setTitle } from '../../app/titlesSlice';
import { fetchAccount, login } from './accountSlice';
import { Login, LoginProps } from './Login';

export function LoginContainer() {
  useEffect(() => {
    store.dispatch(setTitle('Login'));
  });

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
      .tapCatch((error) => setErrorMessage(error.message)) as Promise<void>;
  };

  return (
    <>
      <Snackbar open={!!errorMessage} onClose={handleErrorClose}>
        <Alert severity="error" onClose={handleErrorClose}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <Login onCredentialsChange={handleCredentialsChange} />
    </>
  );
}
