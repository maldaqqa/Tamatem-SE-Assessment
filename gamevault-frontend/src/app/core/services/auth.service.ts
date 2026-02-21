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
    // using signals instead of rxjs subjects here cause its the new angular way and much simpler
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
        // fastapi oauth2 expects form data instead of regular json, kinda annoying but it is what it is
        const formData = new URLSearchParams();
        formData.set('username', credentials.username);
        formData.set('password', credentials.password);
        formData.set('grant_type', 'password');

        return this.http.post(`${this.apiUrl}/login`, formData.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).pipe(
            tap((res: any) => {
                if (res.access_token) {
                    // just chucking the token in localstorage for now. 
                    // in a real app we might want http only cookies for better security
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
