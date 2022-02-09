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
  constructor(private http: HttpClient, private appconfig: AppConfigService) { }





  // tslint:disable-next-line: typedef
  getCatalog(type){
    return this.http.get(this.baseurl + 'getcatalogue?productType='+ type);
  }

  getAreaByDomain(params) {
    return this.http.post(this.baseurl + 'getAreaByDomain', params);
  }
  getCompetency(params) {
    return this.http.post(this.baseurl + 'getpartcularAreawithCompetency', params);
  }
  getAssesments(params) {
    return this.http.post(this.baseurl + 'getAssesmentsByCompetency', params);
  }

// cart services
addToCart(params) {
  
  return this.http.post(this.baseurl + 'addCartDetails ', params);
}
  getCart(params) {
    
    return this.http.post(this.baseurl + 'getCartDetails ', params);
  }

  removeFromCart(params) {
    
    return this.http.post(this.baseurl + 'removeCartDetails ', params);
  }
  getCartCont(params) {
    
    return this.http.post(this.baseurl + 'getCartCount', params);
  }
  encryptdata(request){
    let url = this.baseurl + 'ccavRequestHandler';
    let data = {
    request : request
    }
    return this.http.post(url,request)
  }
  checkassessment(params) {
    
    return this.http.post(this.baseurl + 'checkassessment', params);
  }
  //ORDER
  createOrder(param){
    return this.http.post(this.baseurl + 'createorder', param);
  }
  getOrder(param){
    return this.http.post(this.baseurl + 'getorder', param);
  }
  // SLOTS
  checkingslot(param){
    return this.http.post(this.baseurl + 'checkingslot', param);
  }
  checkingslottestwise(param){
    return this.http.post(this.baseurl + 'checkingslottestwise', param);
  }
  scheduleAssessment(param){
    return this.http.post(this.baseurl +'scheduleAssessment' , param);
  }
  rescheduleAssessment(param){
    return this.http.post(this.baseurl +'rescheduleAssessment' , param);
  }
  userSyncUpLxp(param){
    const reqoptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer aqSkKT6qguVyANMPtR6qqWaiCLUTRNpS7aki0COQm6WEg9WE8VWiopu9rF5oQank2AdWyM3UKr62WUu9l1R1BfaO9CzM16Vi89ecAX6ADPfhGBzpAEXze1do0SqtMkdQ5oGqFqtXphoc4DZL4hb6wRdg09RWzEJcnYJLtvska9HfvQiywtu1LZvDt1AD104ypzLaIRV6dGtKWHrhYgxVn7D3Q9mkTS3oejbVX8z81RwN3Ely6g59t5RRU88BVJiv',
        requestId :'microsetportal'
      })
    };
    return this.http.post(this.baseurl +'userSyncUpLxp' , param, reqoptions);
  }
  stepCrsFrmMicrocert(param){
    return this.http.post(this.baseurl +'stepCrsFrmMicrocert' , param);
  }
  getStepRedirectUrl(email,courseId){
    return this.http.get(this.baseurl + 'getStepRedirectUrl?email='+ email + '&course_id=' +courseId);
  }
  registerQuery(param){
    return this.http.post(this.baseurl +'portalForms' , param);
  }
}
