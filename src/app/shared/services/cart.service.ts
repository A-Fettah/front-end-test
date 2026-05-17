import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {

  private readonly _cartCount = signal<number>(
    Number(sessionStorage.getItem('cart_count')) || 0
  );

  readonly cartCount = this._cartCount.asReadonly();

  updateCount(count: number): void {
    //count always is 1 so I upadate the cartCount by adding 1 
    //instead of setting the new value.
    this._cartCount.update(current => current + count);
    sessionStorage.setItem('cart_count', count.toString());
  }

}