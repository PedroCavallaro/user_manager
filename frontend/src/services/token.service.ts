import { jwtDecode } from 'jwt-decode';

export class TokenService {
  setTokens(token: string, refresh: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('refresh', refresh);
  }

  safeDecode<T>(token: string) {
    try {
      const parsed = jwtDecode<T>(token);

      return parsed;
    } catch (e) {
      return null;
    }
  }

  deleteTokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refresh');
  }
}

export const tokenService = new TokenService();
