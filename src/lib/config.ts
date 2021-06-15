export interface Config {
  apiUrl: string;
}

const key = 'REACT_APP_API_URL';
const envUrl = process.env[key];
if (!envUrl) {
  throw new TypeError(`Environment variable ${key} is required.`);
}

export const config: Config = {
  apiUrl: envUrl,
};

export function isNotProduction() {
  return process.env.NODE_ENV !== 'production';
}
