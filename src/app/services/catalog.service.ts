import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '@env/environment';
import { AppConfigService } from '../utils/app-config.service';
@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  baseurl = environment.API_BASE_URL;
  httpOptionsWithToken;
  constructor(private http: HttpClient, private appconfig: AppConfigService) { }
  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer aqSkKT6qguVyANMPtR6qqWaiCLUTRNpS7aki0COQm6WEg9WE8VWiopu9rF5oQank2AdWyM3UKr62WUu9l1R1BfaO9CzM16Vi89ecAX6ADPfhGBzpAEXze1do0SqtMkdQ5oGqFqtXphoc4DZL4hb6wRdg09RWzEJcnYJLtvska9HfvQiywtu1LZvDt1AD104ypzLaIRV6dGtKWHrhYgxVn7D3Q9mkTS3oejbVX8z81RwN3Ely6g59t5RRU88BVJiv'
    })
  };

  getToken() {
   this.httpOptionsWithToken = {
      headers: new HttpHeaders({
        Authorization: sessionStorage.getItem('token')
      })
    };
  }


  // tslint:disable-next-line: typedef
  getCatalog(type){
    return this.http.get(this.baseurl + 'getcatalogue?productType='+ type, this.httpOptions);
  }

  getAreaByDomain(params) {
    return this.http.post(this.baseurl + 'getAreaByDomain', params, this.httpOptions);
  }
  getCompetency(params) {
    return this.http.post(this.baseurl + 'getpartcularAreawithCompetency', params, this.httpOptions);
  }
  getAssesments(params) {
    return this.http.post(this.baseurl + 'getAssesmentsByCompetency', params, this.httpOptions);
  }

// cart services
addToCart(params) {
  this.getToken();
  return this.http.post(this.baseurl + 'addCartDetails ', params, this.httpOptionsWithToken);
}
  getCart(params) {
    this.getToken();
    return this.http.post(this.baseurl + 'getCartDetails ', params, this.httpOptionsWithToken);
  }

  removeFromCart(params) {
    this.getToken();
    return this.http.post(this.baseurl + 'removeCartDetails ', params, this.httpOptionsWithToken);
  }
  getCartCont(params) {
    this.getToken();
    return this.http.post(this.baseurl + 'getCartCount', params, this.httpOptionsWithToken);
  }
  encryptdata(request){
    let url = this.baseurl + 'ccavRequestHandler';
    let data = {
    request : request
    }
    return this.http.post(url,request)
  }
  checkassessment(params) {
    this.getToken();
    return this.http.post(this.baseurl + 'checkassessment', params, this.httpOptionsWithToken);
  }
  //ORDER
  createOrder(param){
    return this.http.post(this.baseurl + 'createorder', param, this.httpOptions);
  }
  getOrder(param){
    return this.http.post(this.baseurl + 'getorder', param, this.httpOptions);
  }
  // SLOTS
  checkingslot(param){
    return this.http.post(this.baseurl + 'checkingslot', param, this.httpOptionsWithToken);
  }
  checkingslottestwise(param){
    return this.http.post(this.baseurl + 'checkingslottestwise', param, this.httpOptionsWithToken);
  }
  scheduleAssessment(param){
    return this.http.post(this.baseurl +'scheduleAssessment' , param, this.httpOptionsWithToken);
  }
  rescheduleAssessment(param){
    return this.http.post(this.baseurl +'rescheduleAssessment' , param, this.httpOptionsWithToken);
  }
}
