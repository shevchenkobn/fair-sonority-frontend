import { Snackbar } from '@material-ui/core';
import React, { useEffect } from 'react';
import { map } from 'rxjs/operators';
import { Alert } from '../../app/Alert';
import { useAppSelector } from '../../app/hooks';
import { asEffectReset } from '../../lib/rx';
import { getState$, store } from '../../store';
import { hideSnackbar, selectSnackbar } from './snackbarSlice';

export function AppSnackbar() {
  const [snackbar, setSnackbar] = React.useState(
    useAppSelector(selectSnackbar)
  );
  useEffect(
    () =>
      asEffectReset(
        getState$().pipe(map(selectSnackbar)).subscribe(setSnackbar)
      ),
    []
  );
  const content = snackbar
    ? typeof snackbar.content === 'function'
      ? snackbar.content()
      : snackbar.content
    : null;

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    store.dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={!!content}
      onClose={handleClose}
    >
      <Alert severity="error" onClose={handleClose}>
        {content}
      </Alert>
    </Snackbar>
  );
}
