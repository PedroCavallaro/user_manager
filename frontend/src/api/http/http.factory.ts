import type { Api } from "..";
import { AxiosClient } from "../adapters/axios.adapter";
import type { Repository } from "../repositoris";
import type { HttpClientFactory } from "./http.types";

export class HttpFactory implements HttpClientFactory {
	private readonly baseUrl: string;

	constructor(
		baseUrl: string,
		private readonly repos: Repository[],
	) {
		this.baseUrl = baseUrl;
	}

	createAxiosClient(): Api {
		let api = {};

		for (const repo of this.repos) {
			const client = new AxiosClient(this.baseUrl);

			api = { ...api, ...repo.build(client) };
		}

		return api as Api;
	}
}
