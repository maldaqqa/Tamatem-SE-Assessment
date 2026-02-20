import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    location: string;
}

export interface PaginatedProducts {
    total: number;
    page: number;
    size: number;
    items: Product[];
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getProducts(page: number = 1, size: number = 10, location?: string): Observable<PaginatedProducts> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (location) {
            params = params.set('location', location);
        }

        return this.http.get<PaginatedProducts>(`${this.apiUrl}/products`, { params });
    }

    getProduct(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
    }

    buyProduct(id: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/products/${id}/buy`, {});
    }
}
