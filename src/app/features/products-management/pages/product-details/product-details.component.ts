import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../services/product.service';
import { ProductDetail } from '../../models/product.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { take } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    SelectModule,
    ButtonModule, 
    RouterModule,
    ProgressSpinnerModule
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailComponent implements OnInit {

  private route            = inject(ActivatedRoute);
  private router           = inject(Router);
  private fb               = inject(FormBuilder);
  private productService   = inject(ProductService);
  private messageService   = inject(MessageService);

  isLoading                = signal<boolean>(true);
  product                  = signal<ProductDetail | null>(null);
  productForm!:             FormGroup;

  constructor() {
    this.initForm();
  }
  
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
     this.getProduct(id)
    }
  }

  private initForm() {
    this.productForm = this.fb.group({
      colorCode: [null, Validators.required],
      storageCode: [null, Validators.required]
    });
  }

  private getProduct(id: string) {
     this.productService.getProductById(id).subscribe({
        next: (data) => {
          this.product.set(data);
          this.setInitialDefaults(data);
          this.isLoading.set(false); 
        },
        error: () => {
          this.isLoading.set(false);
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Could not load product details' 
          });
        }
      });
  }

  private setInitialDefaults(data: ProductDetail) {
    if (data.options?.colors?.length === 1) {
      this.productForm.patchValue({ colorCode: data.options.colors[0].code });
    }
    if (data.options?.storages?.length === 1) {
      this.productForm.patchValue({ storageCode: data.options.storages[0].code });
    }
  }

  onAddToCart() {
    if (this.productForm.valid && this.product()) {
      const payload = {
        id: this.product()!.id,
        ...this.productForm.value
      };

      this.productService.addProductToCart(payload)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Product Added', 
            detail: `${this.product()?.model} added to your cart` 
          });

          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 1000); 
        },
        error: () => {
          this.messageService.add({ severity: 'error',
             summary: 'Error', 
             detail: 'Could not add product' 
            });
        }
      });
    }
  }
}