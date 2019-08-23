import { Routes, RouterModule } from '@angular/router';
import { NetworkComponent } from './network.component';
const childRoutes: Routes = [
  {
    path: '',
    component: NetworkComponent
  }
];

export const routing = RouterModule.forChild(childRoutes);
