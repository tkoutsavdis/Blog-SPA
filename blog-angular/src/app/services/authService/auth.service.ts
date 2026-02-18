import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:string = environment.apiUrl;

  private loginUrl = `${this.baseUrl}/authentication/login`;
  private refreshTokenUrl = `${this.baseUrl}/authentication/refresh-token`;
  private logoutUrl = `${this.baseUrl}/authentication/logout`;
  private tokenKey = 'authToken';

  constructor(private http:HttpClient) { }

  /* 
        MAIN METHODS
        login , logout , refresh token
  */

  // call login api and set access Token
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(
      this.loginUrl,
      { username, password },
      { withCredentials: true }
    ).pipe(
      tap(res => {
        this.setToken(res.accessToken);
      })
    );
  }

  // generate and set refresh Token
  refreshToken(): Observable<any> {
    return this.http.post<any>(
      this.refreshTokenUrl,
      {},
      { withCredentials: true }
    ).pipe(
      tap(res => {
        this.setToken(res.accessToken);
      })
    );
  }

  // logout and remove Tokens
  logout(): Observable<any> {
    return this.http.post(
      this.logoutUrl,
      {},
      { withCredentials: true }
    ).pipe(
      tap({
        next: () => {
          this.removeToken();
        },
        error: (error) => {
          console.error('Logout error:', error);
          this.removeToken();
        }
      })
    );
  }

  /* 
        HELPER METHODS
  */

  // check if the user is logged in 
  isLoggedIn(): boolean {
    const token = this.getToken();
    const isLoggedIn = token !== null && token !== undefined && token !== '';
    return isLoggedIn;
  }

  // set Token method
  setToken(token: string) {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  // get Token method
  getToken(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }
  
  // remove Token method
  removeToken() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
  }
}