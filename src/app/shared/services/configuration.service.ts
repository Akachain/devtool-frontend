import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
  //staging
    public RedirectUrl = 'http://localhost:4200/login';
    public CallBackUrl = 'http://localhost:4500';
    public ApiIPOff = 'http://localhost:44080';

  public description = 'Development Tool';
  public ApiUrlOff = '/api/';
  public DBOffApiUrl =  this.ApiIPOff + this.ApiUrlOff;
  public appVersion = '1.0.0';
  
}
