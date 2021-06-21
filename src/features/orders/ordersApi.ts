import { api, getTokenPayload } from '../../app/api';
import { Order, OrderOrder, OrderSeed, OrderUpdate } from '../../models/order';
import { UserRole } from '../../models/user';

const url = 'api/order';

export function fetchOrdersApi(): Promise<Order[]> {
  const userKey = getTokenPayload().role === UserRole.Artist ? 'from' : 'to';
  return api.get(url).then((res) => {
    for (const order of res.data) {
      order.user = order[userKey];
      delete order[userKey];
    }
    return res.data;
  });
}

export function createOrderApi(order: OrderSeed): Promise<OrderOrder> {
  return api.post(url, order).then((res) => res.data);
}

export function updateOrderApi(update: OrderUpdate): Promise<OrderOrder> {
  return api.patch(url, update).then((res) => res.data);
}
