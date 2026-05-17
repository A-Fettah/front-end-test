import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductService } from './product.service';
import { CartService } from '../../../shared/services/cart.service';
import { Product, ProductDetail, AddProductPayLoad } from '../models/product.model';
import { environment } from '../../../../environments/environment';

const BASE_URL = environment.baseUrl;

const MOCK_PRODUCTS: Product[] = [
  { id: '1', brand: 'Apple', model: 'iPhone 14', price: '999', imgUrl: '' },
  { id: '2', brand: 'Samsung', model: 'Galaxy S22', price: '799', imgUrl: '' }
];

const MOCK_DETAIL = {
  id: '1', brand: 'Apple', model: 'iPhone 14', price: '999', imgUrl: '',
  options: { colors: [], storages: [] }
} as unknown as ProductDetail;

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  let mockCartService: jasmine.SpyObj<CartService>;

  beforeEach(() => {
    localStorage.clear();
    mockCartService = jasmine.createSpyObj('CartService', ['updateCount']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CartService, useValue: mockCartService }
      ]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts()', () => {
    it('should fetch products from the API', () => {
      service.getProducts().subscribe(products => {
        expect(products).toEqual(MOCK_PRODUCTS);
      });
      httpMock.expectOne(`${BASE_URL}/api/product`).flush(MOCK_PRODUCTS);
    });

    it('should return cached data on second call without hitting the API', () => {
      service.getProducts().subscribe();
      httpMock.expectOne(`${BASE_URL}/api/product`).flush(MOCK_PRODUCTS);

      service.getProducts().subscribe(products => {
        expect(products).toEqual(MOCK_PRODUCTS);
      });
      httpMock.expectNone(`${BASE_URL}/api/product`);
    });
  });

  describe('getProductById()', () => {
    it('should fetch product detail from the API', () => {
      service.getProductById('1').subscribe(detail => {
        expect(detail).toEqual(MOCK_DETAIL);
      });
      httpMock.expectOne(`${BASE_URL}/api/product/1`).flush(MOCK_DETAIL);
    });

    it('should return cached data on second call without hitting the API', () => {
      service.getProductById('1').subscribe();
      httpMock.expectOne(`${BASE_URL}/api/product/1`).flush(MOCK_DETAIL);

      service.getProductById('1').subscribe(detail => {
        expect(detail).toEqual(MOCK_DETAIL);
      });
      httpMock.expectNone(`${BASE_URL}/api/product/1`);
    });
  });

  describe('addProductToCart()', () => {
    it('should POST to api/cart with the given payload', () => {
      const payload: AddProductPayLoad = { id: '1', colorCode: 1, storageCode: 64 };
      service.addProductToCart(payload).subscribe();
      const req = httpMock.expectOne(`${BASE_URL}/api/cart`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush({ count: 1 });
    });

    it('should call CartService.updateCount with the response count', () => {
      const payload: AddProductPayLoad = { id: '1', colorCode: 1, storageCode: 64 };
      service.addProductToCart(payload).subscribe();
      httpMock.expectOne(`${BASE_URL}/api/cart`).flush({ count: 1 });
      expect(mockCartService.updateCount).toHaveBeenCalledWith(1);
    });
  });
});
