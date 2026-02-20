import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService, Product } from './product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container animate-fade-in product-view">
      
      <a routerLink="/products" class="back-link">← Back to Store</a>

      @if (isLoading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Accessing Vault Records...</p>
        </div>
      } @else if (errorMsg()) {
        <div class="empty-state glass-panel">
          <h2>Access Denied</h2>
          <p>{{ errorMsg() }}</p>
          <a routerLink="/products" class="btn-primary" style="display: inline-block; margin-top: 1rem;">Return
            to Store</a>
        </div>
      } @else if (product()) {
        <div class="detail-container glass-panel">
          <!-- Hero Image Area -->
          <div class="detail-image">
            <div class="image-overlay">
               <span class="region-badge" [class.jo]="product()?.location === 'JO'" [class.sa]="product()?.location === 'SA'">
                  {{ product()?.location }}
               </span>
               <div class="icon-representation">⚔️</div>
            </div>
          </div>

          <!-- Content Area -->
          <div class="detail-content">
            <div class="content-header">
              <h1 class="product-title">{{ product()?.title }}</h1>
            </div>
            
            <div class="description-block">
              <h3>Item Description</h3>
              <p class="product-desc">{{ product()?.description }}</p>
            </div>

            <div class="stats-grid">
              <div class="stat-box">
                <span class="stat-label">Item ID</span>
                <span class="stat-value">#GV-{{ product()?.id | number:'3.0-0' }}</span>
              </div>
              <div class="stat-box box-highlight">
                <span class="stat-label">Vault Price</span>
                <span class="stat-value price">{{ product()?.price | currency }}</span>
              </div>
            </div>

            <div class="action-area">
              <button 
                class="btn-primary buy-btn" 
                (click)="purchaseItem()" 
                [disabled]="isPurchasing()">
                {{ isPurchasing() ? 'Initiating Transfer...' : 'Buy Now' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .product-view {
      padding-top: 2rem;
    }

    .back-link {
      display: inline-block;
      margin-bottom: 2rem;
      font-weight: 500;
      color: var(--text-secondary);
      transition: color 0.2s;
    }

    .back-link:hover {
      color: var(--accent-primary);
    }

    /* Layout specific to Detail View */
    .detail-container {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 0;
      overflow: hidden;
      min-height: 500px;
    }

    @media (max-width: 768px) {
      .detail-container {
        grid-template-columns: 1fr;
      }
    }

    .detail-image {
      background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 300px;
    }

    .image-overlay {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-representation {
      font-size: 8rem;
      filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));
      opacity: 0.8;
      transform: scale(1);
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .detail-container:hover .icon-representation {
      transform: scale(1.1);
    }

    .region-badge {
      position: absolute;
      top: 2rem;
      left: 2rem;
      padding: 0.35rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .jo { background: rgba(56, 189, 248, 0.2); color: #38BDF8; border: 1px solid rgba(56, 189, 248, 0.3); }
    .sa { background: rgba(52, 211, 153, 0.2); color: #34D399; border: 1px solid rgba(52, 211, 153, 0.3); }

    .detail-content {
      padding: 3rem;
      display: flex;
      flex-direction: column;
      border-left: 1px solid rgba(255, 255, 255, 0.05);
    }

    .content-header {
      margin-bottom: 2rem;
    }

    .product-title {
      font-size: 2.5rem;
      line-height: 1.1;
      margin-bottom: 0.5rem;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .description-block {
      margin-bottom: 3rem;
      flex-grow: 1;
    }

    .description-block h3 {
      font-size: 1.1rem;
      color: var(--text-primary);
      margin-bottom: 1rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .product-desc {
      font-size: 1.1rem;
      line-height: 1.8;
      color: var(--text-secondary);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-box {
      background: var(--bg-tertiary);
      border-radius: var(--border-radius-md);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
    }

    .box-highlight {
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid rgba(99, 102, 241, 0.2);
    }

    .stat-label {
      font-size: 0.85rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .price {
      color: var(--accent-primary);
      font-size: 2rem;
    }

    .action-area {
      margin-top: auto;
    }

    .buy-btn {
      width: 100%;
      padding: 1.25rem;
      font-size: 1.2rem;
      border-radius: var(--border-radius-lg);
    }

    .spinner {
      margin: 0 auto;
      width: 40px;
      height: 40px;
      border: 4px solid var(--bg-tertiary);
      border-top-color: var(--accent-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin { 100% { transform: rotate(360deg); } }
    .loading-state, .empty-state { text-align: center; padding: 5rem 1rem; }
  `]
})
export class ProductDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  productService = inject(ProductService);

  product = signal<Product | null>(null);
  isLoading = signal<boolean>(true);
  isPurchasing = signal<boolean>(false);
  errorMsg = signal<string>('');

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(parseInt(productId, 10));
    } else {
      this.errorMsg.set('Invalid item coordinates.');
      this.isLoading.set(false);
    }
  }

  loadProduct(id: number) {
    this.productService.getProduct(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching product', err);
        this.errorMsg.set('Item not found in the Vault or access denied.');
        this.isLoading.set(false);
      }
    });
  }

  purchaseItem() {
    const currentProduct = this.product();
    if (currentProduct) {
      this.isPurchasing.set(true);
      this.productService.buyProduct(currentProduct.id).subscribe({
        next: (order) => {
          // Pass the order data to the receipt page via router state
          this.router.navigate(['/receipt'], { state: { orderData: order } });
        },
        error: (err) => {
          console.error('Purchase failed', err);
          this.isPurchasing.set(false);
          alert('Purchase failed. Please try again.');
        }
      });
    }
  }
}
