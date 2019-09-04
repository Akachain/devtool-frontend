import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DbOffService } from '../../shared/services/dbOffSvc.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../shared/services/socket.service';


@Component({
  selector: 'app-chaincode',
  templateUrl: './chaincode.component.html',
  styleUrls: ['./chaincode.component.scss'],

})
export class ChaincodeComponent implements OnInit {
  @ViewChild('customLabel')
  customLabel: ElementRef


  file: File;
  message: string
  tableData: Array<any> = [];
  subscription: Subscription = new Subscription();
  languageForm: FormGroup;
  languages = ['golang', 'node']

  /* pagination Info */
  pageSize = 10;
  pageNumber = 1;

  jsonResponse: any;
  token: string;
  networkData: any;
  disableBtn: boolean = true;

  constructor(
    private dbOffSvc: DbOffService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _socketService: SocketService
  ) {
  }

  ngOnInit() {
    this.languageForm = this.fb.group({
      languageControl: ['golang']
    });
    this.loadData();

    this.subscription = this._socketService
      .getStatusInstall()
      .subscribe((message: string) => {
        if (message === 'INSTALLING') {
          this.showWarning('chaincode is installing...');
        } else if (message === 'INSTALL_SUCCEEDED') {
          this.showSuccess('chaincode install succeeded');
          this.jsonResponse = {
            "result": "true",
            "message": "chaincode install succeeded."
          };
          this.loadData();
        } else {
          this.showError('chaincode install failed');
          this.jsonResponse = {
            "result": "true",
            "message": "chaincode install failed."
          };
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadData() {
    this.spinner.show();
    this.dbOffSvc.getAllChaincode('getAll').toPromise().then(response => {
      if (response.result === 200) {
        this.tableData = response.data;
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    }).catch(err => {
      this.spinner.hide();
      console.log(err);
      this.showError(err);
    });

    this.dbOffSvc.listNetwork('network/getAll').toPromise()
    .then(res => {
      this.networkData = res.data;
      if (this.networkData.length > 0) this.disableBtn = false;
    })
    .catch(err => {
      this.showError(err.message)
    })
  }

  pageChanged(pN: number): void {
    this.pageNumber = pN;
  }

  uploadFileToServer(files: FileList) {
    this.customLabel.nativeElement.innerText = Array.from(files)
      .map(f => f.name).join('');
    this.file = files[0];
  }

  uploadChaincode() {
    if (this.file && !this.disableBtn) {
      const language = this.languageForm.value.languageControl;
      const networkData = {
        name: this.networkData[0].Name,
        orgName: [this.networkData[0].Org1Name, this.networkData[0].Org2Name],
        channelName: this.networkData[0].ChannelName
      }
      this.spinner.show();
      this.dbOffSvc.upload('upload', this.file, language, networkData).toPromise().then(response => {
        this.spinner.hide();
        this.jsonResponse = response;
        this.loadData();
      }).catch(err => {
        this.spinner.hide();
        this.message = 'Cannot connect to server';
        this.showError(this.message);

      });
    } else {
      this.message = 'No file chosen';
      this.showWarning(this.message);

    }
  }

  showSuccess(msg) {
    this.toastr.success(msg, 'Notification');
  }
  showError(msg) {
    this.toastr.error(msg, 'Notification');
  }
  showInfo(msg) {
    this.toastr.info(msg, 'Notification');
  }
  showWarning(msg) {
    this.toastr.warning(msg, 'Notification');
  }

}
