import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './detail.routing';
import { SharedModule } from '../../shared/shared.module';
import { DetailComponent } from './detail.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-modal';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    imports: [
        NgxPaginationModule,
        CommonModule,
        SharedModule,
        routing,
        FormsModule,
        ReactiveFormsModule,
        ModalModule,
        NgxSpinnerModule

    ],
    declarations: [
      DetailComponent
    ]
})
export class DetailModule { }
