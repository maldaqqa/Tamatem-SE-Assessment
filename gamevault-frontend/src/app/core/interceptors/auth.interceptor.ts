import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const token = authService.getToken();

    let requestToForward = req;

    if (token) {
        requestToForward = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
    }

    return next(requestToForward).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Token is invalid or expired (e.g. wiped from another tab but still in memory here)
                authService.logout();
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
};
