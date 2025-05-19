import type { Api } from '..';
import type { HttpClient } from '../http/http-client';

export abstract class Repository {
  public readonly repoName: keyof Api;
  protected readonly api: HttpClient;

  constructor(repoName: keyof Api, api: HttpClient) {
    this.repoName = repoName;
    this.api = api;
  }

  build(_: HttpClient): Repository {
    throw new Error('METHOD NOT IMPLEMENTED');
  }

  handleErrors() {}
}
