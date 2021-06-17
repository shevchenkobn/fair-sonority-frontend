import React from 'react';
import { map } from 'rxjs/operators';
import { useAppSelector } from '../app/hooks';
import { getState$ } from '../app/store';
import { isLoggedIn } from '../features/account/accountSlice';
import { LoginContainer } from '../features/account/LoginContainer';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import { loginPath } from './constants';
import { NotFound } from './NotFound';
import { GuardedRoute } from './GuardedRoute';

export const applyRouter = (app: JSX.Element) => (
  <BrowserRouter>{app}</BrowserRouter>
);

export function AppRoutes() {
  const [auth, setAuth] = React.useState(useAppSelector(isLoggedIn));
  getState$().pipe(map(isLoggedIn)).subscribe(setAuth);

  return (
    <BrowserRouter>
      <Switch>
        <GuardedRoute
          auth={false}
          path={loginPath}
          exact
          component={LoginContainer}
        />
        {auth ? null : <Redirect from="/" exact to={loginPath} />}
        <Route path="*" component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}
