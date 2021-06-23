import { useLocation } from 'react-router';
import { Location } from 'history';
import { logger } from '../app/logger';

export enum Route {
  Login = '/login',
  Home = '/',
  Register = '/register',
  MyOrders = '/orders',
  Artists = '/artists',
}

export function useRouteIsSame() {
  let location: Location<any>;
  let isSame: (pathname: string) => boolean;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    location = useLocation();
    isSame = (pathname) => location.pathname === pathname;
  } catch (error) {
    logger.error('No location loaded, probably provider missing:', error);
    isSame = () => false;
  }
  return { isSame };
}
