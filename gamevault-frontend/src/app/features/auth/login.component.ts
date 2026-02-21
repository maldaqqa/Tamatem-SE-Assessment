import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container animate-fade-in">
      <div class="login-card glass-panel">
        <div class="login-header">
          <h2>Welcome Back</h2>
          <p>Login to access the GameVault Store</p>
        </div>

        @if (errorMsg()) {
          <div class="error-msg">
            {{ errorMsg() }}
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              id="username" 
              type="text" 
              formControlName="username" 
              placeholder="Enter your username"
              [class.is-invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
            >
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password" 
              type="password" 
              formControlName="password" 
              placeholder="Enter your password"
              [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            >
          </div>

          <button type="submit" class="btn-primary login-btn" [disabled]="loginForm.invalid || isLoading()">
            {{ isLoading() ? 'Securing Connection...' : 'Login to Vault' }}
          </button>
        </form>
        
        <div class="dev-note">
          <small>Note: You can log in using the test account (username: <strong>admin</strong>, password: <strong>password</strong>), or register a new account via the <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer">API docs</a>.</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - var(--nav-height) - 6rem);
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 3rem 2.5rem;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .login-header h2 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .is-invalid {
      border-color: var(--error) !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
    }

    .login-btn {
      width: 100%;
      margin-top: 1rem;
      padding: 1rem;
    }

    .error-msg {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
      padding: 0.75rem 1rem;
      border-radius: var(--border-radius-sm);
      border: 1px solid rgba(239, 68, 68, 0.2);
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      text-align: center;
    }
    
    .dev-note {
      text-align: center;
      margin-top: 2rem;
      color: var(--text-secondary);
      opacity: 0.7;
    }
  `]
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  isLoading = signal(false);
  errorMsg = signal('');

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMsg.set('');

      const credentials = {
        username: this.loginForm.value.username!,
        password: this.loginForm.value.password!
      };

      this.authService.login(credentials).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMsg.set('Invalid username or password. Please try again.');
          console.error(err);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
