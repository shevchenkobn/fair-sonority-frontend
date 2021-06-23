import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { map } from 'rxjs/operators';
import { useAppSelector } from '../app/hooks';
import { isLoggedIn, selectRole } from '../features/account/accountSlice';
import { asEffectReset } from '../lib/rx';
import { UserRole } from '../models/user';
import { getState$ } from '../store';
import { Route as RoutePath } from './lib';

export type RouteGuard =
  | {
      auth: boolean;
    }
  | {
      auth?: true;
      authRole: UserRole;
    };

export function GuardedRoute(props: Route['props'] & RouteGuard) {
  const [auth, setAuth] = React.useState(useAppSelector(isLoggedIn));
  const [role, setRole] = React.useState(useAppSelector(selectRole));
  useEffect(
    () => asEffectReset(getState$().pipe(map(isLoggedIn)).subscribe(setAuth)),
    []
  );
  useEffect(
    () => asEffectReset(getState$().pipe(map(selectRole)).subscribe(setRole)),
    []
  );
  const propsAuth = 'auth' in props ? props.auth : true;
  const hasRole =
    ('authRole' in props && role === props.authRole) || !('authRole' in props);
  const routeProps = { ...props } as Record<string, any>;
  delete routeProps.auth;
  delete routeProps.authRole;
  return propsAuth ? (
    auth && hasRole ? (
      <Route {...routeProps} />
    ) : null
  ) : auth ? (
    <Redirect to={RoutePath.Home} />
  ) : (
    <Route {...routeProps} />
  );
}
