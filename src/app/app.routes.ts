import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, 
    children: [
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      },
      {
        path: 'products',
        data: { breadcrumb: 'Products' },
        loadChildren: () => import('./features/products-management/product-management.routes').then(m => m.PRODUCT_ROUTES)
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'products'
  }
];