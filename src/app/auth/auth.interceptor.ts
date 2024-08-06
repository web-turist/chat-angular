import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

let isRefreshing$ = new BehaviorSubject<boolean>(false);

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {

	const authService = inject(AuthService);
	const token: string | null = authService.token;

	if (!token) return next(req);

	if (isRefreshing$.value) {
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
	if (!isRefreshing$.value) {
		isRefreshing$.next(true);

		return authService.refreshAuthToken()
		.pipe(
			switchMap((res) => {

				return next(addTokenInHeaders(req, res.access_token))
				.pipe(
					tap(() => {
						isRefreshing$.next(false);
					})
				)
			})
		)
	}

	if (req.url.includes('refresh')) return next(addTokenInHeaders(req, authService.token!));

	return isRefreshing$.pipe(
		filter(isRefreshing$ => !isRefreshing$),
		switchMap(res => {
			return next(addTokenInHeaders(req, authService.token!))
		})
	)


}

const addTokenInHeaders = (req: HttpRequest<any>, token: string) => {
	return req.clone({
		setHeaders: {
			Authorization: `Bearer ${token}`
		}
	});
}
