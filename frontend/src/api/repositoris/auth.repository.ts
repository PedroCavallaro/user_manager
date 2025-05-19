import type { Api } from '..';
import type { CreateAccountDTO, LoginDTO, TokenResponseDTO } from '../dto';
import type { HttpClient } from '../http/http-client';
import { Repository } from './repository';

export class AuthRepository extends Repository {
  constructor(api: HttpClient) {
    super('auth', api);
  }

  static build(api: HttpClient): Partial<Api> {
    return { auth: new AuthRepository(api) };
  }

  async login(loginDTO: LoginDTO) {
    const res = await this.api.post<TokenResponseDTO>('/auth/login', {
      body: loginDTO,
    });

    return res;
  }

  async socialLogin(token: string) {
    const res = await this.api.post<TokenResponseDTO>('/auth/social', {
      body: { token },
    });

    return res;
  }

  async register(createAccountDTO: CreateAccountDTO) {
    const res = await this.api.post<TokenResponseDTO>('/auth/register', {
      body: createAccountDTO,
    });

    return res;
  }

  async refresh() {
    const res = await this.api.post<TokenResponseDTO>('/auth/refresh', {
      body: { refresh: localStorage.getItem('refresh') ?? '' },
    });

    return res;
  }
}
