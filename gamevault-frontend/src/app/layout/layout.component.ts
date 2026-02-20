import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <nav class="navbar glass-panel">
      <div class="nav-container container">
        <a routerLink="/products" class="brand">
          <span class="brand-icon">🎮</span>
          <span>Game<span class="highlight">Vault</span></span>
        </a>
        
        <div class="nav-links">
          @if (authService.isAuthenticated()) {
            <a routerLink="/products" routerLinkActive="active">Store</a>
            <button class="logout-btn" (click)="logout()">Logout</button>
          } @else {
            <a routerLink="/login" class="login-link">Login</a>
          }
        </div>
      </div>
    </nav>
    <main class="page-wrapper">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: var(--nav-height);
      z-index: 1000;
      border-radius: 0;
      border-top: none;
      border-left: none;
      border-right: none;
    }

    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
    }

    .brand {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .brand-icon {
      font-size: 1.8rem;
    }

    .highlight {
      color: var(--accent-primary);
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .nav-links a {
      color: var(--text-secondary);
      font-weight: 500;
      position: relative;
    }

    .nav-links a:hover, .nav-links a.active {
      color: var(--text-primary);
    }

    .nav-links a.active::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--accent-primary);
      border-radius: 2px;
    }

    .login-link {
      background: var(--glass-bg);
      border: var(--glass-border);
      padding: 0.5rem 1.5rem;
      border-radius: var(--border-radius-lg);
      color: var(--text-primary) !important;
    }

    .login-link:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .logout-btn {
      background: transparent;
      color: var(--error);
      font-weight: 500;
      padding: 0;
    }

    .logout-btn:hover {
      color: #ff6b6b;
      text-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
    }
  `]
})
export class LayoutComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
