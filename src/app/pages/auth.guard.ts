import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DbOffService } from '../shared/services/dbOffSvc.service';
import { Configuration } from '../shared/services/configuration.service';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class AuthGuard implements CanActivate {
  checkLogin = false;
  token: string;
  redirectUrl: string
  callBackUrl: string;
  subscription: Subscription = new Subscription();
  description: string;

  constructor(
    private router: Router,
    private dbOffSvc: DbOffService,
    private _configuration: Configuration,
    private route: ActivatedRoute,

  ) {
    this.redirectUrl = _configuration.RedirectUrl;
    this.callBackUrl = _configuration.CallBackUrl;
    this.description = _configuration.description;
    this.subscription = this.route.queryParams.subscribe(params => {
      if (params.xknxp != null) {
        this.token = params.xknxp;
        localStorage.setItem('_nkypxn', this.token);
      }
    });
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if (next.queryParams.xknxp != null) {
      localStorage.setItem('_nkypxn', next.queryParams.xknxp);
    }
    localStorage.getItem('_nkypxn');
    if (next.queryParams.xknxp != null || localStorage.getItem('_nkypxn') !== null) {
      this.checkLogin = await this.dbOffSvc.checkSession('checkUserSession').toPromise().then(res => {
        if (res.result === 900) {
          return true;
        } else {
          // return false;
        }
      }).catch(err => {
        return false;
      });
      if (!this.checkLogin) {
        window.location.href = this.redirectUrl + '?redirectUrl=' + this.callBackUrl + '&description='+ this.description;
      }
      return this.checkLogin;
    } else {
      window.location.href = this.redirectUrl + '?redirectUrl=' + this.callBackUrl + '&description='+ this.description;
      return false;
    }
  }
}
