import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbComponent } from '../bread-crumb/bread-crumb.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToastModule, BreadcrumbComponent],
  template: `
    <div class="app-layout">
      <app-header />
      <app-breadcrumb />
      <div class="main-container">
        
        <main class="app-content">
          <p-toast />
          <router-outlet />
        </main>
        
      </div>
    </div>
  `,
  styles: `
    .app-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
    }

    .main-container {
      flex: 1;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .app-content {
      flex: 1;
      width: 100%;
    }
  `
})
export class LayoutComponent {}