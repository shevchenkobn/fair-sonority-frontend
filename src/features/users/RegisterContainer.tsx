import { useEffect } from 'react';
import { store } from '../../store';
import { dispatchWithError } from '../../store/lib';
import { showSnackbar } from '../snackbar/snackbarSlice';
import { setTitle } from '../title/titlesSlice';
import { Register, RegisterProps } from './Register';
import { register } from './usersSlice';

export function RegisterContainer() {
  useEffect(() => {
    store.dispatch(setTitle('Register'));
  }, []);

  const handleUserChange: RegisterProps['onUserChange'] = (user) => {
    return dispatchWithError(register(user)).tapCatch((error) =>
      store.dispatch(
        showSnackbar({
          content: 'Register: ' + error.message,
          severity: 'error',
        })
      )
    ) as Promise<void>;
  };

  return <Register onUserChange={handleUserChange} />;
}
