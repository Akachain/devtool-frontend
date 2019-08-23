import { Routes, RouterModule } from '@angular/router';
import { ChaincodeSampleComponent } from './chaincode-sample.component';
// import { AuthGuard } from '../auth.guard';
const childRoutes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard],
    component: ChaincodeSampleComponent
  }
];

export const routing = RouterModule.forChild(childRoutes);
