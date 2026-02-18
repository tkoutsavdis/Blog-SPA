import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/authService/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(public authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    let authReq = request;
  
    if (token) {
      // Check if token is expired
      if (this.isTokenExpired(token)) {
        this.authService.removeToken();  // Remove expired token from localStorage
        return this.handle401Error(authReq, next); // Trigger token refresh
      } else {
        authReq = this.addTokenHeader(request, token); // Add valid token to the request
      }
    }
  
    return next.handle(authReq).pipe(
      catchError(error => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !request.url.includes('/login') &&
          !request.url.includes('/refresh-token')
        ) {
          return this.handle401Error(authReq, next);
        }
        return throwError(() => error);
      })
    );
  }
  

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          const newToken = token.accessToken;
          this.authService.setToken(newToken);
          this.refreshTokenSubject.next(newToken);

          return next.handle(this.addTokenHeader(request, newToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addTokenHeader(request, token!)))
      );
    }
  }


  private isTokenExpired(token: string): boolean {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return Date.now() >= payload.exp * 1000;
    } catch (error) {
      return true; // Treat as expired if there’s an error decoding
    }
  }
}