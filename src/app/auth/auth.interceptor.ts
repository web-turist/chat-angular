import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

let isRefreshing: boolean = false;

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {

	const authService = inject(AuthService);
	const token: string | null = authService.token;

	if (!token) return next(req);

	if (isRefreshing) {
		return refreshAndProceed(authService, req, next);
	}

	req = addTokenInHeaders(req, token);

	return next(req)
		.pipe(
			catchError(error => {
				if (error.status === 403) {

					return refreshAndProceed(authService, req, next);
				}

				return throwError(() => {
					return error;
				})
			})
		)
}


const refreshAndProceed = (
	authService: AuthService,
	req: HttpRequest<any>,
	next: HttpHandlerFn
) => {
	if (!isRefreshing) {
		isRefreshing = true;

		return authService.refreshAuthToken()
		.pipe(
			switchMap((res) => {
				isRefreshing = false;
				return next(addTokenInHeaders(req, res.access_token));
			})
		)
	}

	return next(addTokenInHeaders(req, authService.token!))
}

const addTokenInHeaders = (req: HttpRequest<any>, token: string) => {
	return req.clone({
		setHeaders: {
			Authorization: `Bearer ${token}`
		}
	});
}
