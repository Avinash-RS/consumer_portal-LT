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


  getAddressByUserid(params) {
    return this.http.post(this.baseurl + 'getAddressByUser', params);
  }
  addOrEditAddress(params) {
      return this.http.post(this.baseurl + 'addOrEditAddress', params);
    }
  removeAddress(params) {
    return this.http.post(this.baseurl + 'removeAddress', params);
  }
  getCountryDetails(){
    return this.http.post(this.baseurl + 'getCountryDetails', {});
  }
  getStateDetails(params){
    return this.http.post(this.baseurl + 'getStateDetails',params);
  }
  getDistrictDetails(params){
    return this.http.post(this.baseurl + 'getDistrictDetails', params);
  }
  getAddressTag(){
    return this.http.post(this.baseurl + 'getAddressTag', {});
  }
  removeCartDetails(params){
    return this.http.post(this.baseurl + 'removeCartDetails', params);
  }
}
