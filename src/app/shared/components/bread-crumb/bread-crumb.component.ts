import { Component, inject } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BreadcrumbService } from '../../services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [BreadcrumbModule],
  template: `
    <div class="breadcrumb-container">
      <p-breadcrumb [model]="items()" />
    </div>
  `,
  styles: [`
    .breadcrumb-container {
      padding: 0.5rem 1rem;
      background: transparent;
    }
  `]
})
export class BreadcrumbComponent {
  items = inject(BreadcrumbService).breadcrumbs;
}