import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { MessageService } from 'primeng/api';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Product } from '../../models/product.model';

const MOCK_PRODUCTS: Product[] = [
  { id: '1', brand: 'Apple', model: 'iPhone 14', price: '999', imgUrl: '' },
  { id: '2', brand: 'Samsung', model: 'Galaxy S22', price: '799', imgUrl: '' },
];

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getProducts']);
    mockProductService.getProducts.and.returnValue(of(MOCK_PRODUCTS));

    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: mockProductService },
        { provide: MessageService, useValue: mockMessageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(mockProductService.getProducts).toHaveBeenCalled();
    expect(component.products().length).toBe(2);
    expect(component.isLoading()).toBeFalse();
  });

  it('should filter products by model name', () => {
    component.searchTerm.set('iphone');
    expect(component.filteredProducts().length).toBe(1);
    expect(component.filteredProducts()[0].model).toBe('iPhone 14');
  });

  it('should filter products by brand name', () => {
    component.searchTerm.set('samsung');
    expect(component.filteredProducts().length).toBe(1);
    expect(component.filteredProducts()[0].brand).toBe('Samsung');
  });

  it('should return all products when search term is empty', () => {
    component.searchTerm.set('');
    expect(component.filteredProducts().length).toBe(2);
  });

});

describe('ProductListComponent error handling', () => {
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getProducts']);
    mockProductService.getProducts.and.returnValue(throwError(() => new Error('Network error')));
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: mockProductService },
        { provide: MessageService, useValue: mockMessageService }
      ]
    }).compileComponents();

    TestBed.createComponent(ProductListComponent).detectChanges();
  });

  it('should show error toast when products fail to load', () => {
    expect(mockMessageService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'error' })
    );
  });
});
