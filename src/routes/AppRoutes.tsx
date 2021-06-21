import React from 'react';
import { map } from 'rxjs/operators';
import { useAppSelector } from '../app/hooks';
import { isLoggedIn } from '../features/account/accountSlice';
import { LoginContainer } from '../features/account/LoginContainer';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import { OrderListContainer } from '../features/orders/OrderListContainer';
import { RegisterContainer } from '../features/users/RegisterContainer';
import { getState$ } from '../store';
import { Route as RoutePath } from './lib';
import { NotFound } from './NotFound';
import { GuardedRoute } from './GuardedRoute';

export const applyRouter = (app: JSX.Element) => (
  <BrowserRouter>{app}</BrowserRouter>
);

export function AppRoutes() {
  const [auth, setAuth] = React.useState(useAppSelector(isLoggedIn));
  getState$().pipe(map(isLoggedIn)).subscribe(setAuth);

  return (
    <Switch>
      <GuardedRoute
        auth={false}
        path={RoutePath.Login}
        exact
        component={LoginContainer}
      />
      <GuardedRoute
        auth={false}
        path={RoutePath.Register}
        exact
        component={RegisterContainer}
      />
      <GuardedRoute
        auth={true}
        path={RoutePath.MyOrders}
        exact
        component={OrderListContainer}
      />
      {auth ? (
        <Redirect from={RoutePath.Home} exact to={RoutePath.MyOrders} />
      ) : (
        <Redirect from={RoutePath.Home} exact to={RoutePath.Login} />
      )}
      <Route path="*" component={NotFound} />
    </Switch>
  );
}
