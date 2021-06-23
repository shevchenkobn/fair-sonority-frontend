import { SerializedError } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { Subject } from 'rxjs';
import { config } from '../lib/config';
import { Nullable } from '../lib/types';
import { TokenPayload } from '../models/user';
import { accessTokenKey } from './constants';
import { logger } from './logger';

export const api = axios.create({
  baseURL: config.apiUrl,
});

let excludedPaths = new Set<string>();
export function setExcludedPaths(paths: Iterable<string>) {
  excludedPaths = new Set(paths);
}
export function getExcludedPaths(): ReadonlySet<string> {
  return excludedPaths;
}
export function addExcludedPaths(...paths: string[]) {
  for (const path of paths) {
    excludedPaths.add(path);
  }
}

let accessToken: Nullable<string> =
  localStorage.getItem(accessTokenKey) ?? null;
export function hasAccessToken() {
  return typeof accessToken === 'string';
}
export function setAccessToken(token: string) {
  accessToken = token;
  localStorage.setItem(accessTokenKey, accessToken);
}
export function deleteAccessToken() {
  accessToken = null;
  localStorage.removeItem(accessTokenKey);
}

export function getTokenPayload() {
  if (!accessToken) {
    throw new TypeError('Token not found!');
  }
  return jwtDecode<TokenPayload>(accessToken);
}

api.interceptors.request.use((config) => {
  if (excludedPaths.has(config.url ?? '')) {
    return config;
  }
  if (!hasAccessToken()) {
    logger.error('Request requires access token:', config);
    return config;
  }
  config.headers.Authorization = 'Bearer ' + accessToken;
  return config;
});

const authorizedErrorSubject = new Subject<AxiosResponse>();
export const authorizeError$ = authorizedErrorSubject.asObservable();

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error?.response) {
      return error;
    }
    const res = error.response as AxiosResponse;
    if (
      !getExcludedPaths().has(res.request.url ?? '') &&
      res.status === 401 &&
      res.data.message === 'Unauthorized' &&
      (!accessToken ||
        (jwtDecode<JwtPayload>(accessToken).exp ?? 0) * 1000 <= Date.now())
    ) {
      authorizedErrorSubject.next(res);
    }
    return res;
  }
);

export enum ApiCallStatus {
  Idle = 'idle',
  Loading = 'loading',
}

export interface ApiCallStateBase {
  status: ApiCallStatus;
  error?: SerializedError;
}

export function selectData<T = any>(response: AxiosResponse<T>) {
  return response.data;
}
