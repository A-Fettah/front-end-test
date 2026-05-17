import { Component, input } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Product } from '../models/product.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [BreadcrumbModule, RouterModule, CommonModule],
  template: `
    @if(!!product()) {
        <div class="product-card" [routerLink]="['/products', product().id]">
          <div class="image-wrapper">
            <img [src]="product().imgUrl" [alt]="product().model">
          </div>
          <div class="product()-info">
            <p class="brand">{{ product().brand }}</p>
            <h3 class="model">{{ product().model }}</h3>
            <p class="price">{{ product().price | currency:'EUR' }}</p>
          </div>
        </div>
    }
  `,
  styles: [`
    .product-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 1.5rem;
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        &:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        border-color: #3b82f6;
        }

        .image-wrapper {
        height: 180px;
        margin-bottom: 1.5rem;
        img {
            max-height: 100%;
            object-fit: contain;
        }
        }

        .brand {
        color: #64748b;
        font-size: 0.75rem;
        text-transform: uppercase;
        font-weight: 600;
        margin: 0;
        }

        .model {
        margin: 0.25rem 0 0.75rem;
        font-size: 1.1rem;
        font-weight: 700;
        color: #0f172a;
        }

        .price {
        font-size: 1.2rem;
        font-weight: 800;
        color: #1e40af;
        margin-top: auto;
        }
    }
  `]
})
export class ProductCardComponent {
  product = input.required<Product>();;
}