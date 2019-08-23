import { Routes, RouterModule } from '@angular/router';
import { DocumentComponent } from './document.component';
// import { AuthGuard } from '../auth.guard';
const childRoutes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard],
    component: DocumentComponent
  }
];

export const routing = RouterModule.forChild(childRoutes);
