import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbOffService } from '../../shared/services/dbOffSvc.service';

interface MyWindow extends Window {
  myFunction(): void;
}

declare var window: MyWindow;

@Component({
  selector: 'app-chaincode-sample',
  templateUrl: './chaincode-sample.component.html',
  styleUrls: ['./chaincode-sample.component.scss']
})
export class ChaincodeSampleComponent implements OnInit {
  description: any;
  url: any;
  data: any;
  /* pagination Info */
  pageSize = 10;
  pageNumber = 1;
  jsonResponse = {};
  constructor(
    private spinner: NgxSpinnerService,
    private dbOffSvc: DbOffService

  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.spinner.show();
    this.dbOffSvc.requestChaincodeTemplate('view', {}).toPromise().then(response => {
      this.spinner.hide();
      if (response.result === 200) {
        this.data = response.data;
        this.description = response.data[0].Description;
      }
    }).catch(err => {
      console.log(err);
    });
  }

  pageChanged(pN: number): void {
    this.pageNumber = pN;
  }

  downloadTemplate(url) {
    window.open(url);
  }

  detail(des) {
    this.description = des;
  }
}
