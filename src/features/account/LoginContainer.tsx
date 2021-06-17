import { store } from '../../app/store';
import { setTitle } from '../../app/titlesSlice';
import { fetchAccount, login } from './accountSlice';
import { Login, LoginProps } from './Login';

export function LoginContainer() {
  store.dispatch(setTitle('Login'));

  const handleCredentialsChange: LoginProps['onCredentialsChange'] = (
    credentials
  ) => {
    return store
      .dispatch(login(credentials))
      .then(() => store.dispatch(fetchAccount()))
      .tapCatch((error) => console.error('login', error)) as Promise<void>;
  };

  return <Login onCredentialsChange={handleCredentialsChange} />;
}
