import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, PaginatedProducts } from './product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container animate-fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Game<span>Vault</span> Store</h1>
          <p class="page-subtitle">Browse premium digital game items and currencies</p>
        </div>
        
        <div class="filter-controls">
          <select [(ngModel)]="selectedLocation" (change)="onFilterChange()" class="location-select">
            <option value="">All Regions</option>
            <option value="JO">Jordan Server (JO)</option>
            <option value="SA">Saudi Server (SA)</option>
          </select>
        </div>
      </div>

      @if (isLoading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Decrypting Vault Contents...</p>
        </div>
      } @else if (products().items.length === 0) {
        <div class="empty-state glass-panel">
          <h2>No Items Found</h2>
          <p>The vault is empty for your current filters.</p>
          <button class="btn-primary" (click)="resetFilters()">Reset Search</button>
        </div>
      } @else {
        <div class="product-grid">
          @for (product of products().items; track product.id) {
            <div class="product-card glass-panel" [routerLink]="['/products', product.id]">
              <div class="card-image-placeholder">
                <span class="region-badge" [class.jo]="product.location === 'JO'" [class.sa]="product.location === 'SA'">
                  {{ product.location }}
                </span>
                <div class="icon-representation">⚔️</div>
              </div>
              <div class="card-content">
                <h3 class="product-title">{{ product.title }}</h3>
                <p class="product-desc">{{ product.description }}</p>
                <div class="card-footer">
                  <span class="price">{{ product.price | currency }}</span>
                  <span class="view-btn">View Details →</span>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Pagination Controls -->
        <div class="pagination glass-panel">
          <button 
            [disabled]="currentPage() === 1" 
            (click)="changePage(currentPage() - 1)"
            class="page-btn">
            Previous
          </button>
          
          <span class="page-info">
            Page <span class="highlight">{{ currentPage() }}</span> of {{ totalPages() }}
            <small class="total-items">({{ products().total }} total items)</small>
          </span>

          <button 
            [disabled]="currentPage() >= totalPages()" 
            (click)="changePage(currentPage() + 1)"
            class="page-btn">
            Next
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 3rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-title {
      font-size: 2.5rem;
    }
    
    .page-title span {
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .page-subtitle {
      font-size: 1.1rem;
      margin: 0;
    }

    .location-select {
      width: auto;
      min-width: 200px;
      cursor: pointer;
    }

    /* Fully Responsive Grid Layout */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    /* Product Card Styling */
    .product-card {
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-glow);
      border-color: rgba(99, 102, 241, 0.4);
    }

    .card-image-placeholder {
      height: 160px;
      background: linear-gradient(180deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
      position: relative;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .icon-representation {
      font-size: 5rem;
      filter: drop-shadow(0 10px 15px rgba(0,0,0,0.4));
      opacity: 0.8;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .product-card:hover .icon-representation {
      transform: scale(1.15) rotate(5deg);
    }

    .region-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 1px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }

    .jo { background: rgba(56, 189, 248, 0.2); color: #38BDF8; border: 1px solid rgba(56, 189, 248, 0.3); }
    .sa { background: rgba(52, 211, 153, 0.2); color: #34D399; border: 1px solid rgba(52, 211, 153, 0.3); }

    .card-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    /* Distinct Title Styling as required */
    .product-title {
      font-size: 1.4rem;
      font-weight: 800;
      color: white;
      margin-bottom: 0.75rem;
      line-height: 1.2;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .product-desc {
      font-size: 0.95rem;
      flex-grow: 1;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .price {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--accent-primary);
    }

    .view-btn {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-secondary);
      transition: color 0.2s;
    }

    .product-card:hover .view-btn {
      color: var(--text-primary);
    }

    /* Pagination */
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
    }

    .page-btn {
      background: var(--bg-tertiary);
      color: var(--text-primary);
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color);
    }

    .page-btn:hover:not(:disabled) {
      background: var(--accent-primary);
      border-color: var(--accent-primary);
    }

    .page-info {
      font-weight: 500;
    }

    .total-items {
      color: var(--text-secondary);
      margin-left: 0.5rem;
    }

    /* UX States */
    .loading-state, .empty-state {
      text-align: center;
      padding: 5rem 2rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--bg-tertiary);
      border-top-color: var(--accent-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1.5rem;
    }

    @keyframes spin { 100% { transform: rotate(360deg); } }
  `]
})
export class ProductListComponent implements OnInit {
  productService = inject(ProductService);

  readonly pageSize = 9;

  // State management using Signals
  products = signal<PaginatedProducts>({ total: 0, page: 1, size: this.pageSize, items: [] });
  isLoading = signal<boolean>(true);

  currentPage = signal<number>(1);
  selectedLocation = '';

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.productService.getProducts(this.currentPage(), this.pageSize, this.selectedLocation || undefined)
      .subscribe({
        next: (data) => {
          this.products.set(data);
          this.isLoading.set(false);
          // Scroll to top automatically when changing pages for better UX
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err) => {
          console.error('Error loading products', err);
          this.isLoading.set(false);
        }
      });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadProducts();
    }
  }

  onFilterChange() {
    this.currentPage.set(1); // Reset to first page
    this.loadProducts();
  }

  resetFilters() {
    this.selectedLocation = '';
    this.onFilterChange();
  }

  totalPages(): number {
    return Math.ceil(this.products().total / this.pageSize);
  }
}
