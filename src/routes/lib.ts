import { Location } from 'history';
import { useLocation } from 'react-router';
import { logger } from '../app/logger';

export enum Route {
  Login = '/login',
  Home = '/',
  Register = '/register',
  MyOrders = '/orders',
}

export function isSame(pathname: string) {
  let location;
  try {
    location = useLocation();
    return location.pathname === pathname;
  } catch (error) {
    logger.error('No location loaded, probably provider missing:', error);
    return false;
  }
}
