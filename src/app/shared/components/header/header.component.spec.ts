import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CartService } from '../../services/cart.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  
  const mockCartCountSignal = signal<number>(0);

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', [], {
      cartCount: mockCartCountSignal
    });

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: mockCartService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    
    mockCartCountSignal.set(0);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the logo text "AMS Phones"', () => {
    const logoElement = fixture.debugElement.query(By.css('.logo-link')).nativeElement;
    expect(logoElement.textContent).toContain('AMS Phones');
  });

  it('should render the correct initial cart count value (0)', () => {
    const badgeElement = fixture.debugElement.query(By.css('.cart-badge')).nativeElement;
    expect(badgeElement.textContent.trim()).toBe('0');
  });

  it('should dynamically update the badge text when the cartCount signal changes', () => {
    mockCartCountSignal.set(5);
    fixture.detectChanges();
    
    const badgeElement = fixture.debugElement.query(By.css('.cart-badge')).nativeElement;
    expect(badgeElement.textContent.trim()).toBe('5');
  });

  it('should have a routerLink pointing to the root page "/"', () => {
    const logoDebugElement = fixture.debugElement.query(By.css('.logo-link'));
    expect(logoDebugElement.attributes['routerLink']).toBe('/');
  });
});