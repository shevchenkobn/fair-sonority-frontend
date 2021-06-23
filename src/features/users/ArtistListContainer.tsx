import React, { useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import { store } from '../../store';
import { dispatchWithError } from '../../store/lib';
import { createOrder } from '../orders/ordersSlice';
import { showSnackbar } from '../snackbar/snackbarSlice';
import { setTitle } from '../title/titlesSlice';
import { ArtistList, ArtistListProps } from './ArtistList';
import { createArtistRating, fetchArtists, selectArtists } from './usersSlice';

export function ArtistListContainer() {
  useEffect(() => {
    store.dispatch(setTitle('Artists'));
  }, []);

  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    setLoading(true);
    dispatchWithError(fetchArtists())
      .catch((error) => {
        store.dispatch(
          showSnackbar({
            content: 'Artists loading failed: ' + error.message,
            severity: 'error',
          })
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const handleOrderCreate: ArtistListProps['onOrderCreate'] = (order) => {
    return dispatchWithError(createOrder(order))
      .tapCatch((error) => {
        store.dispatch(
          showSnackbar({
            content: 'Artist order create failed: ' + error.message,
            severity: 'error',
          })
        );
      })
      .then(() => undefined)
      .finally(() => setLoading(false));
  };
  const handleArtistRatingCreate: ArtistListProps['onRatingCreate'] = (
    rating
  ) => {
    return dispatchWithError(createArtistRating(rating))
      .tapCatch((error) => {
        store.dispatch(
          showSnackbar({
            content: 'Artists rating create failed: ' + error.message,
            severity: 'error',
          })
        );
      })
      .then(() => undefined)
      .finally(() => setLoading(false));
  };

  return (
    <ArtistList
      artists={useAppSelector(selectArtists) ?? []}
      disabled={loading}
      onOrderCreate={handleOrderCreate}
      onRatingCreate={handleArtistRatingCreate}
    />
  );
}
