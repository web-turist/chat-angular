import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { tap } from 'rxjs';
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


  get isAuth() {
    if (!this.token) {
      this.token = this.cookieService.get('token');
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
        tap(val => {
          this.token = val.access_token;
          this.refreshToken = val.refresh_token;

          this.cookieService.set('token', this.token);
          this.cookieService.set('refreshToken', this.refreshToken);
        })
      )
      // .subscribe((response) => console.log(response));
  }
}
