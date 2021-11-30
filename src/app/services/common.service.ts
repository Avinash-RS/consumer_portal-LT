import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { AbstractControl } from '@angular/forms';
import { environment } from '@env/environment';
import { AppConfigService } from '../utils/app-config.service';
import { UtilityService } from './utility.service';
import { APP_CONSTANTS } from '../utils/app-constants.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  baseurl = environment.API_BASE_URL;
  httpOptionsWithToken;

  constructor(    private cookieService: CookieService ,private http: HttpClient, private appconfig: AppConfigService,
    public toast: ToastrService, private util: UtilityService) {this.getToken()}
  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer aqSkKT6qguVyANMPtR6qqWaiCLUTRNpS7aki0COQm6WEg9WE8VWiopu9rF5oQank2AdWyM3UKr62WUu9l1R1BfaO9CzM16Vi89ecAX6ADPfhGBzpAEXze1do0SqtMkdQ5oGqFqtXphoc4DZL4hb6wRdg09RWzEJcnYJLtvska9HfvQiywtu1LZvDt1AD104ypzLaIRV6dGtKWHrhYgxVn7D3Q9mkTS3oejbVX8z81RwN3Ely6g59t5RRU88BVJiv'
    })
  };

  getToken(){
    this.httpOptionsWithToken = {
      headers: new HttpHeaders({
        Authorization: this.appconfig.getSessionStorage('token') ? this.appconfig.getSessionStorage('token') : ''
      }),
      params: {}
    };
  }

  // tslint:disable-next-line: typedef
  signup(signupData) {
    return this.http.post(this.baseurl + 'userRegistration', signupData, this.httpOptions);
  }
  // tslint:disable-next-line: typedef
  login(loginData) {
    return this.http.post(this.baseurl + 'userLogin', loginData, this.httpOptions);
  }
  fogetPasswordEmail(mailData) {
    return this.http.post(this.baseurl + 'userforgotPassword', mailData, this.httpOptions);
  }
  resetPassword(pwdData) {
    return this.http.post(this.baseurl + 'submitResetPassword', pwdData, this.httpOptions);
  }

  // Logout
  logout(value?) {
    this.cookieService.delete('isLoggedIn')
    this.cookieService.delete('isLoggedInFunc')
    this.appconfig.clearSessionStorage();
    this.http.post(this.baseurl + 'logout', {}, this.httpOptions);
    if(!value){
      this.appconfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.home);
    } else {
      this.appconfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, { fromPage: '0' });
    }
    
    this.util.headerSubject.next(false);
    this.util.cartSubject.next(false);
    
    //this.toast.success("You've successfully logged out");
  }
  // Validate captcha token
  validateToken(secret: string, token: string) {
    return (_: AbstractControl) => {
      return this.http.get(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`).pipe(map((res: any) => {
        if (res.success) {
          return null;
        }
        return { tokenInvalid: true };
      }));
    }
  }

  //Static Page - Home
  getStaticDataHome() {
    return this.http.get(this.baseurl + 'getdynamicPage1', this.httpOptions);
  }

  //footer
  getFooter() {
    return this.http.get(this.baseurl + 'getdynamicPageFooter', this.httpOptions);
  }

  // certification details
  getCertificationDetails() {
    return this.http.get(this.baseurl + 'getdynamicPage2', this.httpOptions);
  }
  
  profileUpdate(profileData){
    this.getToken();
    return this.http.post(this.baseurl + 'updateProfile', profileData, this.httpOptionsWithToken);
  }

  //UpdateImage
  getprofileImgUpdate(formData) {
    return this.http.post(this.baseurl + 'profileImgUpload', formData);
  }

  getProfile(params){
    this.getToken();
    return this.http.get(this.baseurl + 'getUserInfoById?userId='+ params, this.httpOptionsWithToken);
  }
  // code added
  getmyAssesments(param){
    this.getToken();
    return this.http.post(this.baseurl + 'getmyAssesments',param, this.httpOptionsWithToken); //"userId": "go7m52"
  }
  deactivateAccount(param){
    this.getToken();
    return this.http.post(this.baseurl + 'deactivateAccount',param, this.httpOptionsWithToken); //"userId": "go7m52"
  }
  updatePassword(param){
    this.getToken();
    return this.http.post(this.baseurl + 'updatePassword',param, this.httpOptionsWithToken); //"userId": "go7m52"
  }
  //skill profile
  getPortfolioDetails(param){
    this.getToken();
    return this.http.post(this.baseurl + 'getPortfolioDetails',param, this.httpOptions);
  }
  verifySsotoken(param){

    return this.http.get(environment.sso + '/simplesso/verifytoken?ssoToken='+param, this.httpOptionsWithToken); //"userId": "go7m52"
  }
  getSsotoken(param){

    return this.http.get(environment.sso + '/simplesso/login?serviceURL='+param, this.httpOptionsWithToken); //"userId": "go7m52"
  }
  //skillometer
  getjobDetails(){
    this.getToken();
    return this.http.get(this.baseurl + 'getjobDetails', this.httpOptions);
  }
  getroleDetails(){
    this.getToken();
    return this.http.get(this.baseurl + 'getroleDetails ', this.httpOptions);
  }
  getskillDetails​(param){
    this.getToken();
    return this.http.post(this.baseurl + 'getskillDetails​',param, this.httpOptionsWithToken); 
  }//"userId": "go7m52"
  gototest(param){
    this.getToken();
    return this.http.post(this.baseurl + 'gototest',param, this.httpOptionsWithToken); //"userId": "go7m52"
  }
  postKycUserDetails(kycData){
    return this.http.post(this.baseurl + 'addUserDetails',kycData,this.httpOptionsWithToken)
  }
  getKycUserDetails(userId){
    return this.http.get(this.baseurl + 'getProfileDetailsById?userId=' + userId,this.httpOptionsWithToken) 
  }
  getProfilePercentage(data){
    return this.http.post(this.baseurl + 'profilePercentage',data,this.httpOptions)
  }
  submitUserProfile(data){
    return this.http.post(this.baseurl + 'submitUserProfile',data,this.httpOptions);
  }
  encrypt(data,encryptionKey) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey).toString();
    } catch (e) {
      console.log(e);
      return data;
    }
  }
}

