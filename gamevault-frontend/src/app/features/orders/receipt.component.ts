import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container animate-fade-in receipt-view">
      <div class="receipt-card glass-panel">
        
        <div class="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <div class="receipt-header">
          <h2>Purchase Complete</h2>
          <p>Transaction successfully processed</p>
        </div>

        @if (order) {
          <div class="receipt-details">
            <div class="detail-row">
              <span class="label">Order ID</span>
              <span class="value font-mono">#ORD-{{ order.id | number:'5.0-0' }}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Date</span>
              <span class="value">{{ order.timestamp | date:'medium' }}</span>
            </div>

            <div class="divider"></div>

            <div class="item-block">
              <div class="item-info">
                <h4>{{ order.product.title }}</h4>
                <p>Region: {{ order.product.location }}</p>
              </div>
              <div class="item-price">
                \${{ order.product.price }}
              </div>
            </div>

            <div class="divider"></div>

            <div class="detail-row total-row">
              <span class="label">Total Paid</span>
              <span class="value price">\${{ order.product.price }}</span>
            </div>
          </div>
        } @else {
          <div class="receipt-details">
            <p style="text-align: center; color: var(--text-secondary);">
              No recent transaction data found in session.
            </p>
          </div>
        }

        <div class="actions">
          <a routerLink="/products" class="btn-primary" style="display: block; text-align: center;">Return to Store</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .receipt-view {
      display: flex;
      justify-content: center;
      padding-top: 4rem;
    }

    .receipt-card {
      width: 100%;
      max-width: 500px;
      padding: 3rem;
      position: relative;
      overflow: hidden;
    }

    .receipt-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: var(--accent-gradient);
    }

    .success-icon {
      width: 64px;
      height: 64px;
      background: rgba(16, 185, 129, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      color: var(--success);
    }

    .success-icon svg {
      width: 32px;
      height: 32px;
    }

    .receipt-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .receipt-header h2 {
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
    }

    .receipt-details {
      background: var(--bg-tertiary);
      border-radius: var(--border-radius-md);
      padding: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .detail-row:last-child { margin-bottom: 0; }

    .label {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .value {
      font-weight: 500;
      color: var(--text-primary);
    }

    .font-mono {
      font-family: monospace;
      letter-spacing: 1px;
    }

    .divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      margin: 1.5rem 0;
    }

    .item-block {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .item-info h4 {
      margin-bottom: 0.25rem;
      font-size: 1.1rem;
    }

    .item-info p {
      margin: 0;
      font-size: 0.85rem;
    }

    .item-price {
      font-weight: 700;
      font-size: 1.1rem;
    }

    .total-row .label {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .total-row .price {
      font-size: 1.5rem;
      color: var(--accent-primary);
    }
  `]
})
export class ReceiptComponent implements OnInit {
  router = inject(Router);
  order: any;

  ngOnInit() {
    // Retrieve the order data passed via route state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['orderData']) {
      this.order = navigation.extras.state['orderData'];
    } else {
      // Fallback state logic (e.g. user refreshed the page)
      this.order = history.state['orderData'];
    }

    // Fix naive UTC datetimes by appending 'Z'
    if (this.order && this.order.timestamp && !this.order.timestamp.endsWith('Z')) {
      this.order.timestamp += 'Z';
    }
  }
}
