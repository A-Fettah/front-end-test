import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  afterEach(() => sessionStorage.clear());

  describe('with empty sessionStorage', () => {
    let service: CartService;

    beforeEach(() => {
      sessionStorage.clear();
      TestBed.configureTestingModule({});
      service = TestBed.inject(CartService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize cartCount to 0', () => {
      expect(service.cartCount()).toBe(0);
    });

    it('should increase cartCount when updateCount is called', () => {
      service.updateCount(1);
      expect(service.cartCount()).toBe(1);
    });

    it('should accumulate count across multiple updateCount calls', () => {
      service.updateCount(1);
      service.updateCount(1);
      expect(service.cartCount()).toBe(2);
    });

    it('cartCount should be a readonly signal', () => {
      expect(typeof service.cartCount).toBe('function');
    });
  });

  describe('with pre-existing sessionStorage value', () => {
    it('should initialize cartCount from sessionStorage', () => {
      sessionStorage.setItem('cart_count', '5');
      TestBed.configureTestingModule({});
      const service = TestBed.inject(CartService);
      expect(service.cartCount()).toBe(5);
    });
  });
});
