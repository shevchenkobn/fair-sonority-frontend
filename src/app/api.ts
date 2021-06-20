import axios from 'axios';
import { iterate } from 'iterare';
import { config } from '../lib/config';
import { Nullable } from '../lib/types';
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
export function addExcludedPath(path: string) {
  excludedPaths.add(path);
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

api.interceptors.request.use((config) => {
  if (iterate(excludedPaths).some((p) => config.url == p)) {
    return config;
  }
  if (!hasAccessToken()) {
    logger.error('Request requires access token:', config);
    return config;
  }
  config.headers.Authorization = 'Bearer ' + accessToken;
  return config;
});

export enum ApiCallState {
  Idle = 'idle',
  Loading = 'loading',
}
