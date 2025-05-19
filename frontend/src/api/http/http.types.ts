import { Api } from '..';

export interface RequestOptions {
  headers?: Record<string, string>;
  body?: unknown;
  query?: Record<string, unknown>;
}

export interface HttpClientFactory {
  createAxiosClient(): Api;
}
