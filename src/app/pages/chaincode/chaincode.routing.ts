import { Routes, RouterModule } from '@angular/router';
import { ChaincodeComponent } from './chaincode.component';
// import { AuthGuard } from '../auth.guard';
const childRoutes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard],
    component: ChaincodeComponent
  }
];

export const routing = RouterModule.forChild(childRoutes);
