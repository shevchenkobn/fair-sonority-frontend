import {
  addExcludedPath,
  api,
  deleteAccessToken,
  setAccessToken,
} from '../../app/api';
import { User } from '../../models/user';

export interface Credentials {
  email: string;
  password: string;
}

export interface Tokens {
  accessToken: string;
}

const loginUrl = '/auth/login';
addExcludedPath(loginUrl);
export function loginApi(body: Credentials): Promise<Tokens> {
  return api
    .post(loginUrl, body)
    .then((res) => ({ accessToken: res.data.access_token } as Tokens))
    .tap((tokens) => {
      setAccessToken(tokens.accessToken);
    }) as Promise<Tokens>;
}

export function logoutApi() {
  deleteAccessToken();
}

export function fetchAccountApi(): Promise<User> {
  return api.post('me');
}
