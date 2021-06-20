import {
  addExcludedPath,
  api,
  deleteAccessToken,
  setAccessToken,
} from '../../app/api';
import { Account } from '../../models/user';
import { Credentials } from './types';

interface Tokens {
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

export function fetchAccountApi(): Promise<Account> {
  return api.post('me').then((res) => res.data);
}
