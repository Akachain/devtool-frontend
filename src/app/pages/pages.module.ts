import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './pages.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LayoutModule } from '../shared/layout.module';
import { SharedModule } from '../shared/shared.module';

/* components */
// import { AuthGuard } from './auth.guard';
import { menuService } from '../shared/services/menu.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalModule } from 'ngx-modal';
import { PagesComponent } from './pages.component';


@NgModule({
    imports: [
        CommonModule,
        LayoutModule,
        SharedModule.forRoot(),
        routing,
        FormsModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        ModalModule
    ],
    providers: [
        // AuthGuard,
        menuService,

    ],
    declarations: [
        PagesComponent
    ]
})
export class PagesModule { }
