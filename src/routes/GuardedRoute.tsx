import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { map } from 'rxjs/operators';
import { useAppSelector } from '../app/hooks';
import { getState$ } from '../app/store';
import { isLoggedIn } from '../features/account/accountSlice';
import { asEffectReset } from '../lib/rx';
import { homePath, loginPath } from './constants';

export interface RouteGuard {
  auth: boolean;
}

export function GuardedRoute(props: Route<RouteGuard>['props']) {
  const [auth, setAuth] = React.useState(useAppSelector(isLoggedIn));
  useEffect(() =>
    asEffectReset(getState$().pipe(map(isLoggedIn)).subscribe(setAuth))
  );
  const logInRequired = 'auth' in props ? !!props.auth : true;
  const routeProps = { ...props } as Record<string, any>;
  delete routeProps.auth;
  return logInRequired === auth ? (
    <Route {...routeProps} />
  ) : (
    <Redirect to={logInRequired ? loginPath : homePath} />
  );
}
