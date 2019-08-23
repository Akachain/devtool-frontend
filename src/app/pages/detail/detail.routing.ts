import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from './detail.component';
// import { AuthGuard } from '../auth.guard';
const childRoutes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard],
    component: DetailComponent
  }
];

export const routing = RouterModule.forChild(childRoutes);
