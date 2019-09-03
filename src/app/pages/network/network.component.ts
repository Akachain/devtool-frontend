import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DbOffService } from '../../shared/services/dbOffSvc.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../shared/services/socket.service';


@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],

})
export class NetworkComponent implements OnInit {
  @ViewChild('customLabel')
  customLabel: ElementRef


  file: File;
  message: string;
  subscription: Subscription = new Subscription();
  networkForm: FormGroup;
  formDisabled: Boolean = false;
  getNetwork: any;
  networkData: Array<any> = [];
  submitted = false;

  /* pagination Info */
  pageSize = 10;
  pageNumber = 1;

  jsonResponse: any;
  token: string;

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
    this.networkForm = new FormGroup({
      fabricVersion: new FormControl('1.4.1', Validators.required),
      networkName: new FormControl('', Validators.required),
      channelName: new FormControl('', Validators.required),
      orgName1: new FormControl('', Validators.required),
      orgName2: new FormControl('', Validators.required),
    });

    this.listNetwork()
    this.getNetwork = setInterval(() => this.listNetwork(), 30000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    clearInterval(this.getNetwork);
    this.getNetwork = 0;
  }

  listNetwork() {
    this.dbOffSvc.listNetwork('network/getAll').toPromise()
    .then(res => {
      this.networkData = res.data;
      this.showSuccess('Refreshing network...')
    })
    .catch(err => {
      this.showError(err.message)
    })
  }

  addNetwork() {
    this.submitted = true;
    if (this.networkForm.invalid) {
      return;
    }
    this.formDisabled = true;
    const payload = {
      name: this.networkForm.value.networkName,
      org1Name: this.networkForm.value.orgName1,
      org2Name: this.networkForm.value.orgName2,
      channelName: this.networkForm.value.channelName,
      version: this.networkForm.value.fabricVersion
    }

    this.dbOffSvc.createNetwork('network/create', payload).toPromise()
      .then(res => {
        this.showSuccess(res.message)
        this.formDisabled = false;
      })
      .catch(err => {
        this.showError(err.message)
        this.formDisabled = false;
      })
  }

  get f() { return this.networkForm.controls; }

  pageChanged(pN: number): void {
    this.pageNumber = pN;
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
