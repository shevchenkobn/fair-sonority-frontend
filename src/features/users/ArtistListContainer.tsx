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
    loadArtists();
  }, []);

  const handleOrderCreate: ArtistListProps['onOrderCreate'] = (order) => {
    setLoading(true);
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
    setLoading(true);
    return dispatchWithError(createArtistRating(rating))
      .tapCatch((error) => {
        store.dispatch(
          showSnackbar({
            content: 'Artists rating create failed: ' + error.message,
            severity: 'error',
          })
        );
      })
      .then(() => loadArtists())
      .finally(() => setLoading(false));
    // return Promise.delay(2000)
    //   .then(() => {
    //     throw new Error();
    //   })
    //   .finally(() => setLoading(false)) as Promise<void>;
  };

  return (
    <ArtistList
      artists={useAppSelector(selectArtists) ?? []}
      disabled={loading}
      onOrderCreate={handleOrderCreate}
      onRatingCreate={handleArtistRatingCreate}
    />
  );

  function loadArtists() {
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
  }
}
