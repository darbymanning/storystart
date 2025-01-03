import { Result, ok, err } from 'neverthrow';
import credentials from './credentials';
import { getRegionBaseUrl } from '@storyblok/region-helper';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type ApiError = { code: number; message: string }
type FetcherMethod = <T, E extends ApiError>(
  path: string,
  init?: RequestInit
) => Promise<Result<T, E>>;

class Fetcher {
  private headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': credentials?.token || '',
  };

  constructor(private base_url: string = '') {}

  set_headers(headers: HeadersInit): this {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  private async request<T, E>(
    method: HttpMethod,
    path: string,
    init: RequestInit = {}
  ): Promise<Result<T, E>> {
    try {
      const response = await fetch(`${this.base_url}${path}`, {
        ...init,
        method,
        headers: {
          ...this.headers,
          ...init.headers,
        },
      });

      const data = await response.json();

      return response.ok
        ? ok(data)
        : err({
            code: response.status,
            message: data.message || response.statusText,
          } as E);
    } catch (error) {
      return err({
        code: 500,
        message: error instanceof Error ? error.message : 'Internal Server Error',
      } as E);
    }
  }

  get: FetcherMethod = (path, init) => this.request('GET', path, init);
  post: FetcherMethod = (path, init) => this.request('POST', path, init);
  put: FetcherMethod = (path, init) => this.request('PUT', path, init);
  patch: FetcherMethod = (path, init) => this.request('PATCH', path, init);
  delete: FetcherMethod = (path, init) => this.request('DELETE', path, init);
}

export const content_api = new Fetcher(`${getRegionBaseUrl(credentials?.region || "eu")}/v1`)
export const management_api = new Fetcher("https://mapi.storyblok.com/v1")
