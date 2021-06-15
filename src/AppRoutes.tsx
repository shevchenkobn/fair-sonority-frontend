import { Login } from './features/account/Login';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Login} />
      </Switch>
    </BrowserRouter>
  );
}
