import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './features/auth/login.component';
import { ProductListComponent } from './features/products/product-list.component';
import { ProductDetailComponent } from './features/products/product-detail.component';
import { ReceiptComponent } from './features/orders/receipt.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // keeping login outside the main layout so it doesnt show the navbar
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: LayoutComponent,
        // using a guard here so nobody can peek at the products without logging in first
        canActivate: [authGuard],
        children: [
            { path: 'products', component: ProductListComponent },
            { path: 'products/:id', component: ProductDetailComponent },
            { path: 'receipt', component: ReceiptComponent },
            { path: '', redirectTo: 'products', pathMatch: 'full' }
        ]
    },
    // catch all route just dumps the user back to products if they type a nonsense url
    { path: '**', redirectTo: 'products' }
];
