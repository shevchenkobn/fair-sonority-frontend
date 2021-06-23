import { t } from '../lib/types';

export enum OrderStatus {
  Placed = 'PLACED',
  InProgress = 'IN_PROGRESS',
  Rejected = 'REJECTED',
  AwaitingConfirmation = 'AWAITING_CONFIRMATION',
  Done = 'DONE',
}

export const orderStatusLabels = new Map([
  t(OrderStatus.Placed, 'Placed'),
  t(OrderStatus.InProgress, 'In Progress'),
  t(OrderStatus.Done, 'Done'),
]) as ReadonlyMap<OrderStatus, string>;

export interface OrderDetailed {
  user: OrderUser;
  order: Order;
}

export interface OrderSeed {
  artistId: string;
  bpm: string;
  genre: string[];
  comment: string;
  date: string;
}

export interface Order {
  _id: string;
  artistId: string;
  comment: string;
  /**
   * ISO 8601
   */
  datePlaced: string;
  /**
   * ISO 8601
   */
  deadline: string;
  genre: string[];
  /**
   * Beats per minute
   */
  bpm?: string;
  resultUrl?: string;
  status: OrderStatus;
}

export interface OrderUser {
  name: string;
  id: string;
  lastName: string;
  email: string;
}

export type OrderUpdate = OrderInProgressUpdate | OrderDoneUpdate;

export interface OrderInProgressUpdate extends OrderUpdateBase {
  status: OrderStatus.InProgress;
}

export interface OrderDoneUpdate extends OrderUpdateBase {
  status: OrderStatus.Done;
  resultUrl: string;
}

export interface OrderUpdateBase {
  orderId: string;
  status: OrderStatus;
}
