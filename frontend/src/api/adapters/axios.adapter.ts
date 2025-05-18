import axios, { type AxiosRequestConfig } from "axios";
import { couldStartTrivia } from "typescript";
import type { RequestOptions } from "../http";
import { HttpClient } from "../http/http-client";

export class AxiosClient extends HttpClient {
	protected async doRequest<T>(
		method: string,
		url: string,
		options: RequestOptions,
	): Promise<T> {
		console.log(url);
		if (!this.skipAuthTokenUrls.includes(url)) {
			const authHeader = await this.getAuthTokenHeader();

			options.headers = {
				...options.headers,
				...authHeader,
				"x-api-key": process.env.REACT_APP_API_KEY as string,
			};
		}

		// add interceptors
		const request: AxiosRequestConfig = {
			baseURL: this._concatEndpoint(url, options),
			data: options.body,
			headers: options.headers,
			method,
		};

		const response = await axios.request<T>(request);

		return response.data;
	}
}
