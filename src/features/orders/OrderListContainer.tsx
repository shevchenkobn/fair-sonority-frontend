import React, { useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import { Route, Route as RoutePath } from '../../routes/lib';
import { store } from '../../store';
import { dispatchWithError } from '../../store/lib';
import { showSnackbar } from '../snackbar/snackbarSlice';
import { setTitle } from '../title/titlesSlice';
import { OrderDetailsProps } from './OrderDetails';
import { OrderList, OrderListProps } from './OrderList';
import { fetchOrders, selectOrders, updateOrder } from './ordersSlice';

export function OrderListContainer() {
  useEffect(() => {
    store.dispatch(setTitle('My Orders'));
  }, []);

  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    loadOrders();
  }, []);

  const handleOrderUpdate: OrderDetailsProps['onOrderUpdate'] = (update) => {
    setLoading(true);
    return dispatchWithError(updateOrder(update))
      .tapCatch((error) => {
        store.dispatch(
          showSnackbar({
            content: 'Failed to update order: ' + error.message,
            severity: 'error',
          })
        );
        setLoading(false);
      })
      .then(() => loadOrders()) as Promise<void>;
  };

  return (
    <OrderList
      disabled={loading}
      orders={useAppSelector(selectOrders) ?? []}
      onOrderUpdate={handleOrderUpdate}
    />
  );

  function loadOrders() {
    setLoading(true);
    dispatchWithError(fetchOrders())
      .catch((error) => {
        store.dispatch(
          showSnackbar({
            content: 'Orders loading failed: ' + error.message,
            severity: 'error',
          })
        );
      })
      .finally(() => setLoading(false));
  }
}
