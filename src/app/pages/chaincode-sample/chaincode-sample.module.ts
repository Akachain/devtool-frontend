import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './chaincode-sample.routing';
import { SharedModule } from '../../shared/shared.module';
import { ChaincodeSampleComponent } from './chaincode-sample.component';
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
      ChaincodeSampleComponent
    ]
})
export class ChaincodeSampleModule { }
