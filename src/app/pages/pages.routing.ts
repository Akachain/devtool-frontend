import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';

export const childRoutes: Routes = [
    {
        path: 'pages',
        component: PagesComponent,
        children: [
            { path: '', redirectTo: 'network', pathMatch: 'full' },
            { path: 'sample', loadChildren: './chaincode-sample/chaincode-sample.module#ChaincodeSampleModule' },
            { path: 'chaincode', loadChildren: './chaincode/chaincode.module#ChaincodeModule' },
            { path: 'detail/:id', loadChildren: './detail/detail.module#DetailModule' },
            { path: 'document', loadChildren: './document/document.module#DocumentModule' },
            { path: 'network', loadChildren: './network/network.module#NetworkModule' },

        ]
    }
];

export const routing = RouterModule.forChild(childRoutes);
