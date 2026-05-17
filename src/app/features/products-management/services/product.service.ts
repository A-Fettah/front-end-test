import { Injectable, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { 
  getCacheItem, 
  setCacheItem,  
} from '../../../shared/utils/storage.helpers';
import { ApiService } from '../../../core/services/integrations/api.service';
import { AddProductPayLoad, Product, ProductDetail } from '../models/product.model';
import { CartService } from '../../../shared/services/cart.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
    private readonly apiService = inject(ApiService);
    
    private cartService = inject(CartService);


    getProducts(): Observable<Product[]> {
        const cacheKey = 'productList';
        const cachedData = getCacheItem<Product[]>(cacheKey);

        if (cachedData) {
            return of(cachedData);
        }

        return this.apiService.get<Product[]>('api/product').pipe(
            tap(products => setCacheItem(cacheKey, products))
        );
    }

    getProductById(id: string): Observable<ProductDetail> {
        const cacheKey = `product_detail_${id}`;
        const cachedData = getCacheItem<ProductDetail>(cacheKey);

        if (cachedData) {
            return of(cachedData);
        }

        return this.apiService.get<ProductDetail>(`api/product/${id}`).pipe(
            tap(detail => setCacheItem(cacheKey, detail))
        );
    }

    addProductToCart(data: AddProductPayLoad): Observable<{ count: number }> {
        
        return this.apiService.post<{ count: number }, AddProductPayLoad>('api/cart', data).pipe(
        tap(response => {
            this.cartService.updateCount(response.count);
        })
        );
    }
}