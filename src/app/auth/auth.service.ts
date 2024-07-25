import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, tap, throwError } from 'rxjs';
import { TokenResponse } from './auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  cookieService = inject(CookieService);

  baseApiUrl = 'https://icherniakov.ru/yt-course/auth/';
  token: string | null = null;
  refreshToken: string | null = null;
  router = inject(Router);


  get isAuth() {
    if (!this.token) {
      this.token = this.cookieService.get('token');
      this.refreshToken = this.cookieService.get('refreshToken');
    }

    return !!this.token;
  }

  /**
   * В данном случе переводим JSON в FormData из-зы особенности бэкенда
   * @param payload данные из формы
   * @returns
   */
  login(payload: { username: string; password: string }) {

    const formData = new FormData();
    formData.append('username', payload.username);
    formData.append('password', payload.password);

    return this.http.post<TokenResponse>(`${this.baseApiUrl}token`, formData)
      .pipe(
        tap(val => this.saveTokens(val))
      )
      // .subscribe((response) => console.log(response));
  }

  refreshAuthToken() {
    return this.http.post<TokenResponse>(`${this.baseApiUrl}refresh`, {
      refresh_token: this.refreshToken
    }).pipe(
      tap(val => this.saveTokens(val)),
      catchError(error => {
        this.logout();
        return throwError(() => {return error});
      })
    )
  }

  logout() {
    this.cookieService.deleteAll();
    this.token = null;
    this.refreshToken = null;
    this.router.navigate(['/login'])
  }

  saveTokens(res: TokenResponse) {
    this.token = res.access_token;
    this.refreshToken = res.refresh_token;

    this.cookieService.set('token', this.token);
    this.cookieService.set('refreshToken', this.refreshToken);
  }
}
