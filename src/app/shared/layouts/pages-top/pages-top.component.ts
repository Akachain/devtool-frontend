import { Component, Input, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { DbOffService } from '../../services/dbOffSvc.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Configuration } from '../../services/configuration.service';


@Component({
  selector: 'pages-top',
  templateUrl: './pages-top.component.html',
  styleUrls: ['./pages-top.component.scss'],
})
export class PagesTopComponent implements OnInit {

  avatarImgSrc: string = 'assets/images/avatar.png';
  userName: string = '';
  eMail: string = '';
  akachainlogo = 'assets/images/logo-full-white2x.png';
  subscription: Subscription = new Subscription();
  redirectUrl: string;
  callBackUrl: string;
  description: string;
  sidebarToggle: boolean = true;
  tip = { ring: true, email: true };
  token: any;
  walletAddress: any;
  notificationArr: any = [];
  unreadNotifications: any;
  Detail: string;
  organizationName: any;
  accountType: any;

  constructor(
    private _globalService: GlobalService,
    private dbOffSvc: DbOffService,
    private router: Router,
    private route: ActivatedRoute,
    private _configuration: Configuration
  ) {
    this.redirectUrl = _configuration.RedirectUrl;
    this.callBackUrl = _configuration.CallBackUrl;
    this.description = _configuration.description
    this.subscription = this.route.queryParams.subscribe(params => {
      if (params.xknxp != null) {
        this.token = params.xknxp;
      }
    });
  }

  ngOnInit(): void {
    this.getNotification();
  }

  signOut() {
    this.dbOffSvc.logOut('logout').toPromise().then(res => {
      if (res.result === 200) {
        window.location.href = this.redirectUrl + '?redirectUrl=' + this.callBackUrl + '&description=' + this.description;
      } else {
      }
    }).catch(err => {
      console.log(err);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public _sidebarToggle() {
    /* this._globalService.sidebarToggle$.subscribe(sidebarToggle => {
      this.sidebarToggle = sidebarToggle;
    }, error => {
      console.log('Error: ' + error);
    }); */

    this._globalService.data$.subscribe(data => {
      if (data.ev === 'sidebarToggle') {
        this.sidebarToggle = data.value;
      }
    }, error => {
      console.log('Error: ' + error);
    });
    this._globalService.dataBusChanged('sidebarToggle', !this.sidebarToggle);

    //this._globalService._sidebarToggleState(!this.sidebarToggle);
  }
  getNotification() {
    this.notificationArr = [];
    this.dbOffSvc.getNotification('notification/getByUser').toPromise().then(response => {
      if (response.result === 200) {
        response.data.readNotifications.forEach(element => {
          let elm = {
            'Id': element.Id,
            'Detail': element.Detail,
            'unRead': false
          }
          this.notificationArr.push(elm);
        });
        response.data.unreadNotifications.forEach(element => {
          let elm = {
            'Id': element.Id,
            'Detail': element.Detail,
            'unRead': true
          }
          this.notificationArr.push(elm);
        });
        this.unreadNotifications = response.data.unreadNotifications.length;
        this.notificationArr = this.notificationArr.sort((a, b) => b.Id - a.Id)
      } else {
      }
    }).catch(err => {
      console.log(err);
    });
  }

  readNo(id: number, detail: string) {
    this.Detail = detail;
    document.getElementById("openModalButton").click();
    const data = { "notificationId": [id] }
    this.dbOffSvc.postNotification('notification/addNotifiedUser', data).toPromise().then(response => {
      if (response.result === 200) {
      } else {
      }
    }).catch(err => {
      console.log(err);
    });
  }

  onClose() {
    this.getNotification();
  }
}
