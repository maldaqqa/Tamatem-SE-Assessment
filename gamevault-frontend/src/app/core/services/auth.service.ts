import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;

    // Signal to hold auth state reactively
    isAuthenticated = signal<boolean>(this.hasToken());

    constructor(private http: HttpClient, private router: Router) {
        // Listen for cross-tab login/logout events natively
        window.addEventListener('storage', (event) => {
            if (event.key === 'auth_token' && event.newValue === null) {
                // Token was removed in another tab
                this.isAuthenticated.set(false);
                this.router.navigate(['/login']);
            }
        });
    }

    login(credentials: { username: string, password: string }): Observable<any> {
        const formData = new URLSearchParams();
        formData.set('username', credentials.username);
        formData.set('password', credentials.password);
        formData.set('grant_type', 'password');

        return this.http.post(`${this.apiUrl}/login`, formData.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).pipe(
            tap((res: any) => {
                if (res.access_token) {
                    localStorage.setItem('auth_token', res.access_token);
                    this.isAuthenticated.set(true);
                }
            })
        );
    }

    logout() {
        localStorage.removeItem('auth_token');
        this.isAuthenticated.set(false);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    hasToken(): boolean {
        return !!this.getToken();
    }
}
