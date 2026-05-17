import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { InputTextModule } from 'primeng/inputtext'; 
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { MessageService } from 'primeng/api';
import { ProductCardComponent } from '../../components/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, 
    FormsModule, InputTextModule, 
    ProgressSpinnerModule, ProductCardComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private productService      = inject(ProductService);
  private messageService      = inject(MessageService);

  isLoading                   = signal<boolean>(true);
  products                    = signal<Product[]>([]);
  
  searchTerm                  = signal<string>('');

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    return this.products().filter(p => 
      p.model.toLowerCase().includes(term) || 
      p.brand.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.getProducts();
  }

  private getProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false); 
      },
      error: () => {
        this.isLoading.set(false);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Could not load products' 
        });
      }
    });
  }
}