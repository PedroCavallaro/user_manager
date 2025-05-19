import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { ROUTES } from '../../App';
import type { RequestOptions } from '../http';
import { HttpClient, type RequestResult } from '../http/http-client';

export class AxiosClient extends HttpClient {
  protected async doRequest<T>(
    method: string,
    url: string,
    options: RequestOptions
  ): Promise<RequestResult<T>> {
    try {
      if (!this.skipAuthTokenUrls.includes(url)) {
        const authHeader = await this.getAuthTokenHeader();

        options.headers = {
          ...options.headers,
          ...authHeader,
          'x-api-key': process.env.REACT_APP_API_KEY as string,
        };
      }

      const request: AxiosRequestConfig = {
        baseURL: this._concatEndpoint(url, options),
        data: options.body,
        headers: options.headers,
        method,
      };

      const response = await axios.request<T>(request);

      return { data: response.data };
    } catch (e) {
      if (e instanceof AxiosError) {
        return { data: {} as T, error: e?.response?.data?.message };
      }

      return { data: {} as T, error: 'Erro ao comunicar com o servidor' };
    }
  }

  interceptors() {
    axios.interceptors.response.use((response) => {
      if (response.status !== 401) return response;

      if ([ROUTES.register, ROUTES.login].includes(window.location.pathname))
        return response;

      return response;
    });
  }
}
