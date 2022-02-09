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

  constructor(    private cookieService: CookieService ,private http: HttpClient, private appconfig: AppConfigService,
    public toast: ToastrService, private util: UtilityService) {}



  // tslint:disable-next-line: typedef
  signup(signupData) {
    return this.http.post(this.baseurl + 'userRegistration', signupData);
  }
  // tslint:disable-next-line: typedef
  login(loginData) {
    return this.http.post(this.baseurl + 'userLogin', loginData);
  }
  fogetPasswordEmail(mailData) {
    return this.http.post(this.baseurl + 'userforgotPassword', mailData);
  }
  resetPassword(pwdData) {
    return this.http.post(this.baseurl + 'submitResetPassword', pwdData);
  }

  // Logout
  logout(value?) {
    this.cookieService.delete('isLoggedIn')
    this.cookieService.delete('isLoggedInFunc')
    this.appconfig.clearSessionStorage();
    this.appconfig.clearLocalStorage();
    this.http.post(this.baseurl + 'logout', {});
    if(!value){
      this.appconfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.home);
    } else {
      this.appconfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, { fromPage: '0' });
    }
    
    this.util.headerSubject.next(false);
    this.util.cartSubject.next(false);
    this.util.showkycProgress.next(false);
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
    return this.http.get(this.baseurl + 'getdynamicPage1');
  }

  //footer
  getFooter() {
    return this.http.get(this.baseurl + 'getdynamicPageFooter');
  }

  // certification details
  getCertificationDetails() {
    return this.http.get(this.baseurl + 'getdynamicPage2');
  }
  
  profileUpdate(profileData){
    
    return this.http.post(this.baseurl + 'updateProfile', profileData);
  }

  //UpdateImage
  getprofileImgUpdate(formData) {
    return this.http.post(this.baseurl + 'profileImgUpload', formData);
  }

  getProfile(params){
    
    var value = {
      'userId': params
    }
    return this.http.post(this.baseurl + 'getUserInfoById',value);
  }
  // code added
  getmyAssesments(param){
    
    return this.http.post(this.baseurl + 'getmyAssesments',param);
  }
  deactivateAccount(param){
    
    return this.http.post(this.baseurl + 'deactivateAccount',param); 
  }
  updatePassword(param){
    
    return this.http.post(this.baseurl + 'updatePassword',param); 
  }
  //skill profile
  getPortfolioDetails(param){
    
    return this.http.post(this.baseurl + 'getPortfolioDetails',param);
  }
  verifySsotoken(param){

    return this.http.get(environment.sso + '/simplesso/verifytoken?ssoToken='+param); 
  }
  getSsotoken(param){

    return this.http.get(environment.sso + '/simplesso/login?serviceURL='+param); 
  }
  //skillometer
  getjobDetails(){
    
    return this.http.get(this.baseurl + 'getjobDetails');
  }
  getroleDetails(){
    
    return this.http.get(this.baseurl + 'getroleDetails ');
  }
  getskillDetails​(param){
    
    return this.http.post(this.baseurl + 'getskillDetails​',param); 
  }//"userId": "go7m52"
  gototest(param){
    
    return this.http.post(this.baseurl + 'gototest',param); 
  }
  postKycUserDetails(kycData){
    return this.http.post(this.baseurl + 'addUserDetails',kycData)
  }
  getKycUserDetails(userId){
    var value = {
      'userId': userId
    }
    return this.http.post(this.baseurl + 'getProfileDetailsById',value) 
  }
  getProfilePercentage(data){
    return this.http.post(this.baseurl + 'profilePercentage',data)
  }
  submitUserProfile(data){
    return this.http.post(this.baseurl + 'submitUserProfile',data);
  }
  encrypt(data,encryptionKey) {
    try {
      return CryptoJS.AES.encrypt(data, encryptionKey.trim()).toString();
    } catch (e) {
      return data;
    }
  }
}

