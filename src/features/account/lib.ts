import { store } from '../../store';
import { showSnackbar } from '../snackbar/snackbarSlice';

export function showLoginErrorSnackbar(error: any) {
  store.dispatch(
    showSnackbar({
      content: 'Login: ' + error.message,
      severity: 'error',
    })
  );
}
