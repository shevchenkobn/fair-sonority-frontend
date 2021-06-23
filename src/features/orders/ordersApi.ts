import { api, selectData, getTokenPayload } from '../../app/api';
import {
  OrderDetailed,
  Order,
  OrderSeed,
  OrderUpdate,
} from '../../models/order';
import { UserRole } from '../../models/user';

const url = 'api/order';

export function fetchOrdersApi(): Promise<OrderDetailed[]> {
  const userKey = getTokenPayload().role === UserRole.Artist ? 'from' : 'to';
  return api.get(url).then((res) => {
    for (const order of res.data) {
      order.user = order[userKey];
      delete order[userKey];
    }
    return res.data;
  });
}

export function createOrderApi(order: OrderSeed): Promise<Order> {
  return api.post(url, order).then(selectData);
}

export function updateOrderApi(update: OrderUpdate): Promise<Order> {
  return api.patch(url, update).then(selectData);
}
