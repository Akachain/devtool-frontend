import { Component, OnInit ,OnDestroy, ViewChild, ElementRef,} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DbOffService } from '../../shared/services/dbOffSvc.service';
import { GlobalService } from '../../shared/services/global.service';
import { menuService } from '../../shared/services/menu.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../shared/services/socket.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  @ViewChild('customLabel')
  customLabel: ElementRef

  bodyInvoke: { "chaincodeId": string; "fcn": string; "args": any[]; };
  bodyQuery: {};
  bodyInit: {};
  token: string;
  message: string;
  file: File;
  
  tableData: Array<any> = [];
  chaincodeId: string;
  chaincodeLanguage: string = 'go';
  chaincodeVersion: string = '';
  isSolidity: boolean = false;

  fieldInit: Array<any> = [];
  fieldQuery: Array<any> = [];
  fieldInvoke: Array<any> = [];
  fieldUpgrade: Array<any> = [];

  newAttribute: any = {};

  firstField = true;
  firstFieldName = 'First Item name';
  isEditItems: boolean;

  jsonResponse :any;
  logChaincode: any;
  chaincodeDetail = {};

  languageForm: FormGroup;
  languages = ['golang', 'node']
  subscriptionUpgrade: Subscription;
  subscriptionInit: Subscription;

  isInit: boolean = false;
  networkData: any;
  disableBtn: boolean = true;


  constructor(
    private route: ActivatedRoute,
    private dbOffSvc: DbOffService,
    private _globalService: GlobalService,
    private _menuService: menuService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _socketService: SocketService


  ) {

  }

  ngOnInit() {
    this.languageForm = this.fb.group({
      languageControl: ['golang']
    });
    this.getChaincode();

    this.subscriptionUpgrade = this._socketService
    .getStatusUpgrade()
      .subscribe((message: string) => {
        if (message === 'UPGRADING') {
          this.getChaincode();
          this.showWarning('chaincode is upgrading...');
        } else if (message === 'UPGRADE_SUCCEEDED') {
          this.getChaincode();
          this.showSuccess('chaincode upgrade succeeded');
          this.jsonResponse = {
            "result": "true",
            "message": "chaincode upgrade succeeded."
          };
        } else {
          this.getChaincode();
          this.showError('chaincode upgrade failed');
          this.jsonResponse = {
            "result": "true",
            "message": "chaincode upgrade failed."
          };
        }
      });
    this.subscriptionInit = this._socketService
    .getStatusInit()
    .subscribe((message: string) => {
      if (message === 'INITIALIZING') {
        this.showWarning('chaincode is initializing...');
      } else if (message === 'INIT_SUCCEEDED') {
        this.showSuccess('chaincode init succeeded');
        this.jsonResponse = {
          "result": "true",
          "message": "chaincode init succeeded."
        };
        this.getChaincode();
      } else {
        this.showError('chaincode init failed');
        this.getChaincode();
        this.jsonResponse = {
          "result": "true",
          "message": "chaincode init failed."
        };
      }
    });

    this.dbOffSvc.listNetwork('network/getAll').toPromise()
    .then(res => {
      if (res.data.length > 0) {
        this.disableBtn = false;
        this.networkData = {
          name: res.data[0].Name,
          orgName: [res.data[0].Org1Name, res.data[0].Org2Name],
          channelName: res.data[0].ChannelName
        }
      }
    })
    .catch(err => {
      this.showError(err.message)
    })

  }

  ngOnDestroy(): void {
    this.subscriptionInit.unsubscribe();
    this.subscriptionUpgrade.unsubscribe();

  }

  getChaincode(): void {
    this.spinner.show();
    this.chaincodeId = this.route.snapshot.paramMap.get('id');
    this.dbOffSvc.get(`chaincode/${this.chaincodeId}`).toPromise().then(response => {
      this.spinner.hide();
      if (response.result === 200) {
        this.tableData = response.data;
        this.token = response.data[0].SecretKey;
        this.chaincodeVersion = response.data[0].Version.toFixed(2) + '';
        this.chaincodeLanguage = response.data[0].Language;
        response.data[0].InitStatus === 'success' ? this.isInit = true : this.isInit = false;

        if (this.chaincodeLanguage == 'solidity') {
          this.isSolidity = true;
        }

        this.chaincodeDetail = JSON.parse(response.data[0].Description);
        this.bodyInit = {
          "chaincodeId": this.chaincodeId + '',
          "chaincodeVersion": this.chaincodeVersion,
          "args": []
        };
        this.bodyQuery = {
          "chaincodeId": this.chaincodeId + '',
          "fcn": "Your_function_name",
          "args": ["Your_args"]
        };
        this.bodyInvoke = {
          "chaincodeId": this.chaincodeId + '',
          "fcn": "Your_function_name",
          "args": ["Your_args"]
        };

      }
    }).catch(err => {
      this.spinner.hide();
      console.error(err);
    });
  }

  addFieldInit() {
    this.newAttribute = {};
    this.fieldInit.push(this.newAttribute);
  }

  deleteFieldInit(index) {
    this.fieldInit.splice(index, 1);
  }

  addFieldQuery() {
    this.fieldQuery.push(this.newAttribute);
    this.newAttribute = {};
  }

  deleteFieldQuery(index) {
    this.fieldQuery.splice(index, 1);
  }

  addFieldInvoke() {
    this.fieldInvoke.push(this.newAttribute);
    this.newAttribute = {};
  }

  deleteFieldInvoke(index) {
    this.fieldInvoke.splice(index, 1);
  }

  addFieldUpgrade() {
    this.fieldUpgrade.push(this.newAttribute);
    this.newAttribute = {};
  }

  deleteFieldUpgrade(index) {
    this.fieldUpgrade.splice(index, 1);
  }

  init() {
    this.spinner.show();
    let dataInit = [];
    for (let i = 1; i <= this.fieldInit.length; i++) {
      let param = (<HTMLInputElement>document.getElementById('init' + i)).value;
      dataInit.push(param);
    }
    const data = { "chaincodeId": this.chaincodeId + '', "chaincodeVersion": this.chaincodeVersion,"language": this.chaincodeLanguage ,"args": dataInit, "orgName": this.networkData.orgName[0], "channelName": this.networkData.channelName };
    this.dbOffSvc.chaincode('init', this.token, data).toPromise().then(response => {
      if (response.result == 102) {
        this.spinner.hide();
        this.jsonResponse = {
          "result": "true",
          "message": "Chaincode is initializing... Please wait a while and check init status."
        }
      } else {
        this.spinner.hide();
        this.jsonResponse = response;
      }
    }).catch(err => {
      this.spinner.hide();
      this.message = "Cannot connect to server";
      this.showError(this.message);

    });
  }

  //query function 
  query() {
    this.spinner.show();
    let dataQuery = [];
    for (let i = 1; i <= this.fieldQuery.length; i++) {
      let param = (<HTMLInputElement>document.getElementById('query' + i)).value;
      dataQuery.push(param);
    }

    let fcn = (<HTMLInputElement>document.getElementById('fcnQuery')).value
    const data = { "chaincodeId": this.chaincodeId + '', "fcn": fcn, "args": dataQuery, "orgName": this.networkData.orgName[0], "channelName": this.networkData.channelName };
    this.dbOffSvc.chaincode('query', this.token, data).toPromise().then(response => {
      // this.getLogChaincode();
      this.spinner.hide();
      this.jsonResponse = response;
    }).catch(err => {
      this.spinner.hide();
      this.message = "Cannot connect to server";
      this.showError(this.message);

    });
  }

  //invoke function
  invoke() {
    this.spinner.show();
    let dataInvoke = [];
    for (let i = 1; i <= this.fieldInvoke.length; i++) {
      let param = (<HTMLInputElement>document.getElementById('invoke' + i)).value;
      dataInvoke.push(param);
    }
    let fcn = (<HTMLInputElement>document.getElementById('fcnInvoke')).value
    const data = { "chaincodeId": this.chaincodeId + '', "fcn": fcn, "args": dataInvoke, "orgName": this.networkData.orgName[0], "channelName": this.networkData.channelName };
    this.dbOffSvc.chaincode('invoke', this.token, data).toPromise().then(response => {
      this.getChaincode();
      this.spinner.hide();
      this.jsonResponse = response;
    }).catch(err => {
      this.spinner.hide();
      this.message = "Cannot connect to server";
      this.showError(this.message);

    });
  }

  //upgrade function
 uploadFileToServer(files: FileList) {
  this.customLabel.nativeElement.innerText = Array.from(files)
    .map(f => f.name).join('');
  this.file = files[0];
}

  upgradeChaincode() {
    let dataUpgrade = [];
    for (let i = 1; i <= this.fieldUpgrade.length; i++) {
      let param = (<HTMLInputElement>document.getElementById('upgrade' + i)).value;
      dataUpgrade.push(param);
    }

    if (this.file && !this.disableBtn) {
      this.spinner.show();
      const language = this.languageForm.value.languageControl ;
      this.dbOffSvc.upgrade('upload', this.file, this.chaincodeId + '', this.chaincodeVersion,language, JSON.stringify(dataUpgrade), this.networkData).toPromise().then(response => {
        if (response.result == 102) {
          this.spinner.hide();
          this.jsonResponse = {
            "result": "true",
            "message": "Chaincode is upgrading... Please wait a while and check upgrade status."
          }
        } else {
          this.spinner.hide();
          this.jsonResponse = response;
          this.getChaincode();
        }
      }).catch(err => {
        this.spinner.hide();
        this.message = "Cannot connect to server";
        this.showError(this.message);

      });
    } else {
      this.message = 'No file chosen'
      this.showWarning(this.message);

    }
  }

  // getLogChaincode() {
  //   this.spinner.show();
  //   const data = { "chaincodeId": this.chaincodeId + '', "chaincodeVersion": this.chaincodeVersion };
  //   this.dbOffSvc.getLog('getlog', data).toPromise().then(response => {
  //     this.spinner.hide();
  //     if (response.status === 200) {
  //       this.logChaincode = response.log;
  //     } else {
  //       this.logChaincode = '';
  //     }
  //   }).catch(err => {
  //     this.spinner.hide();
  //     this.message = "Cannot connect to server";
  //     this.showError(this.message);

  //   });
  // }

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
