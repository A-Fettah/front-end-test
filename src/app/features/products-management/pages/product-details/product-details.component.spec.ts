import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailComponent } from './product-details.component';
import { ProductService } from '../../services/product.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ProductDetail } from '../../models/product.model';

const MOCK_PRODUCT = {
  id: '1',
  brand: 'Apple',
  model: 'iPhone 14',
  price: '999',
  imgUrl: '',
  options: {
    colors: [{ code: 1, name: 'Black' }, { code: 2, name: 'White' }],
    storages: [{ code: 64, name: '64GB' }]
  }
} as unknown as ProductDetail;

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getProductById', 'addProductToCart']);
    mockProductService.getProductById.and.returnValue(of(MOCK_PRODUCT));
    mockProductService.addProductToCart.and.returnValue(of({ count: 1 }));

    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        provideRouter([]),
        provideAnimations(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: ProductService, useValue: mockProductService },
        { provide: MessageService, useValue: mockMessageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product by id on init', () => {
    expect(mockProductService.getProductById).toHaveBeenCalledWith('1');
    expect(component.product()?.model).toBe('iPhone 14');
    expect(component.isLoading()).toBeFalse();
  });

  it('should auto-select storage when only one option is available', () => {
    expect(component.productForm.value.storageCode).toBe(64);
  });

  it('should not auto-select color when multiple options are available', () => {
    expect(component.productForm.value.colorCode).toBeNull();
  });

  it('should not call addProductToCart when form is invalid', () => {
    component.productForm.patchValue({ colorCode: null, storageCode: null });
    component.onAddToCart();
    expect(mockProductService.addProductToCart).not.toHaveBeenCalled();
  });

  it('should call addProductToCart with correct payload when form is valid', () => {
    component.productForm.patchValue({ colorCode: 1, storageCode: 64 });
    component.onAddToCart();
    expect(mockProductService.addProductToCart).toHaveBeenCalledWith({
      id: '1',
      colorCode: 1,
      storageCode: 64
    });
  });

  it('should show success toast after adding to cart', () => {
    component.productForm.patchValue({ colorCode: 1, storageCode: 64 });
    component.onAddToCart();
    expect(mockMessageService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'success' })
    );
  });

  it('should show error toast when add to cart fails', () => {
    mockProductService.addProductToCart.and.returnValue(throwError(() => new Error('Server error')));
    component.productForm.patchValue({ colorCode: 1, storageCode: 64 });
    component.onAddToCart();
    expect(mockMessageService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'error' })
    );
  });

});

describe('ProductDetailComponent error handling', () => {
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getProductById', 'addProductToCart']);
    mockProductService.getProductById.and.returnValue(throwError(() => new Error('Not found')));
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        provideRouter([]),
        provideAnimations(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: ProductService, useValue: mockProductService },
        { provide: MessageService, useValue: mockMessageService }
      ]
    }).compileComponents();

    TestBed.createComponent(ProductDetailComponent).detectChanges();
  });

  it('should show error toast when product fails to load', () => {
    expect(mockMessageService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'error' })
    );
  });
});
