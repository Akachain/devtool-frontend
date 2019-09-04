
import { map } from 'rxjs/operators';
import { Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Configuration } from './configuration.service';




@Injectable()
export class DbOffService {
  private actionUrl: string;
  private ssoAuthSvcUrl: string;
  private headers: Headers = new Headers();
  private options: RequestOptions;

  constructor(private _http: Http, private _configuration: Configuration) {
    this.actionUrl = this._configuration.DBOffApiUrl;
    this.headers.set('Content-Type', 'application/json');
    this.headers.set('Access-Control-Allow-Origin', '*');
    // this.headers.set('Access-Control-Allow-Headers', 'App-Name');
  }

  // Get
  get(ns: string): Observable<any> {
    return this._http.get(this.actionUrl + ns, { headers: this.headers }).pipe(map((response: Response) => response.json()));
  }

  logOut(ns: string): Observable<any> {
    return this._http.get(this.ssoAuthSvcUrl + ns, { headers: this.headers }).pipe(map((response: Response) => response.json()));
  }

  checkSession(ns: string): Observable<any> {
    return this._http.get(this.ssoAuthSvcUrl + ns, { headers: this.headers }).pipe(map((response: Response) => response.json()));
  }

  listNetwork(ns: string): Observable<any> {
    return this._http.get(this.actionUrl + ns, { headers: this.headers }).pipe(map((response: Response) => response.json()));
  }

  getAllChaincode(ns: string): Observable<any> {
    return this._http.get(this.actionUrl + 'chaincode/' + ns, { headers: this.headers }).pipe(map((response: Response) => response.json()));
  }

  // POST API
  post(ns: string, data: any): Observable<any> {
    return this._http.post(this.actionUrl + ns, data, { headers: this.headers }).pipe(map((response: Response) => response.json()));
  }

  // Delete by Id
  delete(ns: string, id: any): Observable<any> {
    return this._http.delete(this.actionUrl + ns + '/' + id, { headers: this.headers }).pipe(map((response: Response) => response.json()));
  }

  // Update by Id with data
  update(ns: string, id: any, data: any): Observable<any> {
    return this._http.put(this.actionUrl + ns + '/' + id, data, { headers: this.headers }).pipe(map((response: Response) => response.json()));
  }

  // PUT API: update
  put(ns: string, data: any): Observable<any> {
    return this._http.put(this.actionUrl + ns, data, { headers: this.headers }).pipe(map((response: Response) => response.json()));
  }

  requestChaincode(ns: string, data: any): Observable<any> {
    return this._http.post(this.actionUrl + 'chaincode/' + ns, data, { headers: this.headers }).pipe(map((response: Response) => response.json()));
  }

  getLog(ns: string, data: any): Observable<any> {
    return this._http.post(this.actionUrl + ns, data, { headers: this.headers }).pipe(map((response: Response) => response.json()));
  }

  chaincode(ns: string, token: string, data: any): Observable<any> {
    return this._http.post(this.actionUrl + 'chaincode/' + ns, data, { headers: this.headers }).pipe(map((response: Response) => response.json()));
  }

  requestChaincodeTemplate(ns: string, data: any): Observable<any> {
    return this._http.post(this.actionUrl + 'chaincodeTemplate/' + ns, data, { headers: this.headers }).pipe(map((response: Response) => response.json()));
  }

  upload(ns: string, data: any, language : string, networkData: any): Observable<any> {
    this.headers.delete('Content-Type');
    const formData = new FormData();
    formData.set('name', networkData.name);
    formData.set('orgName[0]', networkData.orgName[0]);
    formData.set('orgName[1]', networkData.orgName[1]);
    formData.set('channelName', networkData.channelName);
    formData.set('language', language);
    formData.set('chaincode', data, data.name);
    return this._http.post(this.actionUrl + ns, formData, { headers: this.headers }).pipe(map((response: Response) => response.json()));
  }

  upgrade(ns: string, data: any, chaincodeId: string, chaincodeVersion: string,language:string, dataUpgrade: any, networkData: any): Observable<any> {
    this.headers.delete('Content-Type');
    const formData = new FormData();
    formData.set('chaincode', data, data.name);
    formData.set('chaincodeId', chaincodeId);
    formData.set('chaincodeVersion', chaincodeVersion);
    formData.set('name', networkData.name);
    formData.set('orgName[0]', networkData.orgName[0]);
    formData.set('orgName[1]', networkData.orgName[1]);
    formData.set('channelName', networkData.channelName);
    formData.set('language', language);
    formData.set('args', dataUpgrade);

    return this._http.post(this.actionUrl + ns, formData, { headers: this.headers }).pipe(map((response: Response) => response.json()));
  }

  // create network
  createNetwork(ns: string, data: any): Observable<any> {
    return this._http.post(this.actionUrl + ns, data, { headers: this.headers }).pipe(map((response: Response) => response.json()));
  }

  //test
  getNotification(ns: string): Observable<any> {
    return this._http.get(this.actionUrl + ns, { headers: this.headers }).pipe(map((response: Response) => response.json()));
  }

  postNotification(ns: string, data: any): Observable<any> {
    return this._http.post(this.actionUrl + ns, data, { headers: this.headers }).pipe(map((response: Response) => response.json()));
  }
}
