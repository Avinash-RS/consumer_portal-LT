import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import * as bcrypt from 'bcryptjs';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConfigService } from 'src/app/utils/app-config.service';
import { APP_CONSTANTS } from 'src/app/utils/app-constants.service';
import { CatalogService } from "../../../services/catalog.service";
import { GlobalValidatorsService } from 'src/app/validators/global-validators.service';
import { UtilityService } from 'src/app/services/utility.service';
import { CookieService } from 'ngx-cookie-service';
import * as qs from 'querystring';
import { MatDialog } from '@angular/material/dialog';
import * as CryptoJS from 'crypto-js';
import { environment } from '@env/environment';
import { RecaptchaErrorParameters } from "ng-recaptcha";
import { CartService } from 'src/app/services/cart.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  @ViewChild('OptionData') searchedcollageData: ElementRef;
  collegeFilter: any = { collegename: '' };
  collagename: any;
  collageId: any;
  isloadData;
  hide = true;
  hide1 = true;
  entryIndex;
  loginForm: FormGroup;
  registerForm: FormGroup;
  showKyc: boolean = false;
  userDetails: any;
  secretKey = "(!@#Passcode!@#)";
  recaptchaStr = '';
  siteKey: any = environment.captachaSiteKey;
  collegeData: any = [];
  departmentData: any = [];
  collegeflag = false;
  yearData = ['2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'];
  otherData = {
    collegeId: "0",
    collegename: "Others",
    collegeshortcode: ""
  }
  @ViewChild('kycmandate', { static: false }) matDialogRef: TemplateRef<any>;
  @ViewChild('captchaRef',{ static: false }) captchaRef;
  constructor(public route: ActivatedRoute,
    public commonService: CommonService,
    public toast: ToastrService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    // private recaptchaV3Service: ReCaptchaV3Service,
    private gv: GlobalValidatorsService,
    private util: UtilityService,
    private catalogService : CatalogService,
    private cookieService: CookieService ,
    private router:Router, 
    private cartsevice: CartService
  ) {
    this.appconfig.clearSessionStorage();
    this.route.queryParams.subscribe(params => {
      if (params.fromPage == '0') {
        this.entryIndex = 0;
        this.loginFormInitialize();
        if(params.activation == '1'){
          this.toast.success('Account activated successfully');
          // this.showKyc = true
        }
      } else {
        this.entryIndex = 1;
        this.registerFormInitialize();
        this.getCollegeMaster();
        this.getDepartmentMaster();
        if(params.activation == '1'){
          this.toast.error('Activation link expired, please register again');
        }
      }
    });
  }

  ngOnInit() {
   /* const params = qs.parse(window.location.search.substring(1));
    const email = qs.parse(window.location.search.substring(2));
    const password = qs.parse(window.location.search.substring(3));
    if(params.ssoToken){
      this.cookieService.set('isLoggedIn','true')
     // this.verifySsotoken(params.ssoToken)
    }
    if(!this.cookieService.get('isLoggedIn')){
      window.location.href = "http://52.172.236.38:3015/simplesso/login?serviceURL="+location.origin;
    }else{
      if(!this.cookieService.get('isLoggedInFunc')){
        this.login(email.email,password.password)
        this.cookieService.set('isLoggedInFunc','true')
      }else{
        console.log('testing')
          // window.location.href = "http://52.172.236.38:3015/simplesso/login?serviceURL="+location.origin;
          // window.location.reload(false)
          // this.login(email.email,password.password)
          //this.router.navigate(['/Home'])
      }
    }*/
    setTimeout(()=>{
      this.captchaRef.reset();
    },1000);
  }
  dialogSetup(){
      const valdat = this.dialog.open(this.matDialogRef, {
        width: '400px',
        height: '400px',
        autoFocus: true,
        closeOnNavigation: true,
        disableClose: true,
        panelClass: 'popupModalContainerForForms'
      });
  }

  tabChange(e) {
    if (e.index == 1) {
      this.entryIndex = 1;
      this.showKyc=false
      this.appconfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, { fromPage: e.index });
      this.registerFormInitialize();
    } else {
      this.entryIndex = 0;
      this.showKyc=false
      this.appconfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, { fromPage: e.index });
      this.loginFormInitialize();
    }
    this.recaptchaStr = '';
    setTimeout(()=>{
      this.captchaRef.reset();
    },1000);
  }

  submitRegister() {
    if (this.registerForm.valid) {
      if (!this.collegeflag){
        this.toast.warning('Please select valid college name');
        return false;
      }
      var encryptedname = CryptoJS.AES.encrypt(this.registerForm.value.email.toLowerCase().trim(), this.secretKey.trim()).toString();
      var encryptedpassword = CryptoJS.AES.encrypt(this.registerForm.value.password.trim(), this.secretKey.trim()).toString();

      const signupData = {
        firstname: this.registerForm.value.firstName.trim(),
        lastname: this.registerForm.value.lastName.trim(),
        userOrigin:CryptoJS.AES.encrypt(environment.userOrigin, this.secretKey.trim()).toString(),
        collegeId:this.registerForm.value.college.trim(),
        password: encryptedpassword,
        openPassword:this.registerForm.value.password.trim(),
        email: encryptedname,
        termsandConditions: this.registerForm.value.termsandConditions,
        isAdmin: false,
        badgeRequest:this.recaptchaStr,
        universityEnrollNo: this.registerForm.value.enrollNumber.trim(),
        graduationYear: this.registerForm.value.graduation.trim(),
        departmentId: this.registerForm.value.department.trim(),
        mobile: this.registerForm.value.enrollNumber.trim(),
      };
      this.commonService.signup(signupData).subscribe((data: any) => {
        if (data.success) {
          this.registerForm.reset()
          this.registerForm.markAsUntouched();
          // this.appconfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, { fromPage: 0 });
          this.toast.success(data.message);
        } else {
          this.toast.error(data.message);
        }
      });
    } else {
      this.gv.validateAllFields(this.registerForm);
    }
  }
 
  onError(errorDetails: RecaptchaErrorParameters): void {
  }
//register
checkCaptchaSignIn(captchaSignIn){
  if (this.recaptchaStr) {
    captchaSignIn.reset();
}
captchaSignIn.execute();
}
resolvedSignIn(captchaSignInResponse: string){
  this.recaptchaStr = captchaSignInResponse;
  if (this.recaptchaStr) {
      if(this.entryIndex == 0){
        this.onSubmit();
      }
      else{
      this.submitRegister();
      }
  }
}
  onSubmit() {
    //this.cookieService.set('isLoggedIn','true')
    if (this.loginForm.valid) {
      var encryptedname = CryptoJS.AES.encrypt(this.loginForm.value.email.toLowerCase().trim(), this.secretKey.trim()).toString();
      var encryptedpassword = CryptoJS.AES.encrypt(this.loginForm.value.password.trim(), this.secretKey.trim()).toString();
      let loginData = {
        email: encryptedname,
        password: encryptedpassword,
        isAdmin: false,
        badgeRequest:this.recaptchaStr
      };
      this.commonService.login(loginData).subscribe((data: any) => {
        // console.log(data, 'karthik Data')
        if (data.success) {
          data.data['emailId'] = data.data.email
          data.data.email = CryptoJS.AES.encrypt(data.data.email.toLowerCase(), this.secretKey.trim()).toString();
          data.data.userId = CryptoJS.AES.encrypt(data.data.userId.toLowerCase(), this.secretKey.trim()).toString();
          this.appconfig.setLocalStorage('userDetails', JSON.stringify(data.data));
          this.appconfig.setLocalStorage('token', data.token);
          this.appconfig.setLocalStorage('profileImage', data.data.profileImage);
          this.loginForm.reset();
          var portalData = {
            'queValue':encryptedname,
            'rpValue':encryptedpassword
          }
          this.appconfig.setLocalStorage('valueData', JSON.stringify(portalData));
          this.util.headerSubject.next(true);
          this.util.cartSubject.next(true);
          this.util.isEnrolled.next(true);
          this.util.getValue().subscribe((response) => {
            if (response) {
              this.userDetails = JSON.parse(this.appconfig.getLocalStorage('userDetails'));
              if (this.userDetails) {

              // const data = {
              //   "noofFields": "44",
              //   "email": this.userDetails.email ? this.userDetails.email : null
              // }
              // this.commonService.getProfilePercentage(data).subscribe((result: any) => {
              //   if (result?.success) {
              //     //let profilePercentage = result.data[0].profilePercentage;
              //     //let KYCFlag = result.data[0].KYCMandFlag ? result.data[0].KYCMandFlag : 0;
              //     let KYCFlag = 1;
              //     if (KYCFlag == 0) {
              //      this.dialogSetup();
              //       this.appconfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.home);
              //     }else{
              //       response.userId = this.userDetails.userId
              //     this.catalogService.addToCart(response).subscribe((cart: any) => {
              //       if (cart.success) {
              //         this.util.cartSubject.next(true);
              //         this.appconfig.routeNavigation('cart/purchase');
              //       } else {
              //         this.appconfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.home)
              //         this.toast.warning(cart.message)
              //       }
              //     })
              //     }
              //   }
              //   else {
              //     return false
              //   }
              // });
                //   this.cookieService.set('isLoggedIn','true')
              }
            } else {
              this.appconfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.home);
            }
        })
       //   this.toast.success(data.message);
        } else {
          this.toast.error(data.message);
        }
      });
    } else {
      this.gv.validateAllFields(this.loginForm);
    }
  }

  loginFormInitialize() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, this.gv.email()]],
      password: ['', [Validators.required]],
    });
  }

  checkBatchRec() {
    this.collagename = [];
    this.collageId = '';
    setTimeout(() => {
      if (this.searchedcollageData) {
        this.isloadData = false;
      } else {
        this.isloadData = true;
      }
    });
  }

  getCollegeMaster(){
    const apiParm = {
      userOrigin:CryptoJS.AES.encrypt(environment.userOrigin, this.secretKey.trim()).toString(),
    };
    this.cartsevice.getCollegeDetails(apiParm).subscribe((result:any)=>{
      if(result?.success && result?.data.length > 0){
        this.collegeData = result?.data;
         this.collegeData.unshift(this.otherData)
      }
    })
  }

  getDepartmentMaster(){
    this.cartsevice.getDepartmentDetails().subscribe((result:any)=>{
      if(result?.success && result?.data.length > 0){
        this.departmentData = result?.data;
      }
    })
  }

  registerFormInitialize() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, this.gv.alphaNum30()]],
      lastName: ['', [Validators.required, this.gv.alphaNum30()]],
      email: ['', [Validators.required, this.gv.email()]],
      mobile: ['', [Validators.required, this.gv.mobile(), this.gv.mobileRegex()]],
      college: ['', [Validators.required]],
      department: ['', [Validators.required]],
      enrollNumber: ['', [Validators.required]],
      graduation: ['', [Validators.required]],
      password: ['', [Validators.required, this.gv.passwordRegex(), Validators.minLength(8), Validators.maxLength(32)]],
      password2: ['', [Validators.required]],
      termsandConditions: [null, [Validators.requiredTrue]],
    }, {validators: this.gv.passwordMatcher()});
  }

  privacy() {
    window.open("https://lntedutech.com/privacy-policy-2/", "privacyPolicy")
  }
  terms() {
    window.open("https://info.lntedutech.com/", "terms")
  }


  // Login form getter
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  get loginCaptcha() {
    return this.loginForm.get('captcha');
  }

  // Register form getter
  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get emailR() {
    return this.registerForm.get('email');
  }

  get collegeR() {
    return this.registerForm.get('college');
  }
 
  get passwordR() {
    return this.registerForm.get('password');
  }
  get password2() {
    return this.registerForm.get('password2');
  }

  get termsandConditions() {
    return this.registerForm.get('termsandConditions');
  }
  get dept() {
    return this.registerForm.get('department');
  }
 
  get rollNumber() {
    return this.registerForm.get('enrollNumber');
  }
  get year() {
    return this.registerForm.get('graduation');
  }

  get mobileNo() {
    return this.registerForm.get('mobile');
  }

  get captcha() {
    return this.registerForm.get('captcha');
  }

  gotoForgetPwd() {
    this.appconfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.onBoard.forgetpwd);
  }

  login(email,password){
    if(email&&password){
    let loginData = {
      email: email,
      password: password,
      isAdmin: false
    };
    this.commonService.login(loginData).subscribe((data: any) => {
      // console.log(data, 'karthik Data')
      if (data.success) {
        this.appconfig.setLocalStorage('userDetails', JSON.stringify(data.data));
        this.appconfig.setLocalStorage('token', data.token);
        this.appconfig.setLocalStorage('profileImage', data.data.profileImage);
        this.util.headerSubject.next(true);
        this.util.cartSubject.next(true);
        this.util.getValue().subscribe((response) => {
          if (response) {
            var userDetails = JSON.parse(this.appconfig.getLocalStorage('userDetails'));
            if(userDetails) {
           //   this.cookieService.set('isLoggedIn','true')
            response.userId = userDetails.userId
            this.catalogService.addToCart(response).subscribe((cart:any) =>{
              if(cart.success) {
                this.util.cartSubject.next(true);
                this.appconfig.routeNavigation('cart/purchase');
              } else {
                this.toast.warning('Something went wrong')
              }
            })
          }
          } else {
            this.appconfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.home);
          }
      })
      } else {
        this.toast.error(data.message);
      }
    });
  }else{
    console.log('trying to login')
  }
  }
  navigateProfile(){
    this.router.navigate(['/userProfile']);
  }
}
