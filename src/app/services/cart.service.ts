import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '@env/environment';
import { AppConfigService } from '../utils/app-config.service';
/**
 * @description
 * @class
 */
@Injectable({providedIn: 'root'})
export class CartService {

  baseurl = environment.API_BASE_URL;
  constructor(private http: HttpClient, private appconfig: AppConfigService) { }
  httpOptionsWithToken = {
    headers: new HttpHeaders({
      Authorization: this.appconfig.getSessionStorage('token') ? this.appconfig.getSessionStorage('token') : ''
    })
  };

  getAddressByUserid(params) {
    return this.http.post(this.baseurl + 'getAddressByUser', params, this.httpOptionsWithToken);
  }
  addOrEditAddress(params) {
      return this.http.post(this.baseurl + 'addOrEditAddress', params, this.httpOptionsWithToken);
    }
  removeAddress(params) {
    return this.http.post(this.baseurl + 'removeAddress', params, this.httpOptionsWithToken);
  }
  getCountryDetails(){
    return this.http.post(this.baseurl + 'getCountryDetails', {}, this.httpOptionsWithToken);
  }
  getStateDetails(params){
    return this.http.post(this.baseurl + 'getStateDetails',params, this.httpOptionsWithToken);
  }
  getDistrictDetails(params){
    return this.http.post(this.baseurl + 'getDistrictDetails', params, this.httpOptionsWithToken);
  }
  getAddressTag(){
    return this.http.post(this.baseurl + 'getAddressTag', {}, this.httpOptionsWithToken);
  }
  removeCartDetails(params){
    return this.http.post(this.baseurl + 'removeCartDetails', params, this.httpOptionsWithToken);
  }
}
