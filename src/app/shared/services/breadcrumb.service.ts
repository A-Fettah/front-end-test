import { Injectable, signal, inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  readonly breadcrumbs = signal<MenuItem[]>([]);

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const root = this.activatedRoute.root;
        const breadcrumbs: MenuItem[] = [{ icon: 'pi pi-home', routerLink: '/' }];
        this.generateBreadcrumbs(root, '', breadcrumbs);
        this.breadcrumbs.set(breadcrumbs);
      });
  }

  private generateBreadcrumbs(route: ActivatedRoute, url: string, breadcrumbs: MenuItem[] = []): void {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) return;

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map((segment) => segment.path).join('/');
      
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data['breadcrumb'];
      
      if (label && (breadcrumbs.length === 0 || breadcrumbs[breadcrumbs.length - 1].label !== label)) {
        breadcrumbs.push({ label, routerLink: url });
      }

      this.generateBreadcrumbs(child, url, breadcrumbs);
    }
  }
}