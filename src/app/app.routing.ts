import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages/pages.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'pages/network',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'pages/network'
  }
];

export const routing = RouterModule.forRoot(appRoutes);
