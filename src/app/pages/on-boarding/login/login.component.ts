import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  hide = true;
  hide1 = true;
  entryIndex;
  loginForm: FormGroup;
  registerForm: FormGroup;
  showKyc: boolean = false;
  userDetails: any;
  secretKey = "(!@#Passcode!@#)";

  @ViewChild('kycmandate', { static: false }) matDialogRef: TemplateRef<any>;
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
    private router:Router
  ) {
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
          //this.router.navigate(['/assessmentHome'])
      }
    }*/
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
      this.registerFormInitialize();
      this.entryIndex = 1;
      this.showKyc=false
      this.appconfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, { fromPage: e.index });
    } else {
      this.loginFormInitialize();
      this.entryIndex = 0;
      this.showKyc=false
      this.appconfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, { fromPage: e.index });
    }
  }

  submitRegister() {
    if (this.registerForm.valid) {
      // const salt = bcrypt.genSaltSync(10);
      // const pass = bcrypt.hashSync(this.registerForm.value.password, salt);
      const encryptPass = this.commonService.encrypt(this.registerForm.value.password,this.secretKey)
      const signupData = {
        firstname: this.registerForm.value.firstName,
        lastname: this.registerForm.value.lastName,
        password: encryptPass,
        openPassword:this.registerForm.value.password,
        email: this.registerForm.value.email,
        termsandConditions: this.registerForm.value.termsandConditions,
        isAdmin: false
      };
      this.commonService.signup(signupData).subscribe((data: any) => {
        if (data.success) {
          this.registerForm.reset();
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

  onSubmit() {
    //this.cookieService.set('isLoggedIn','true')
    if (this.loginForm.valid) {
      const encryptPass = this.commonService.encrypt(this.loginForm.value.password,this.secretKey);
      let loginData = {
        email: this.loginForm.value.email,
        password: encryptPass,
        isAdmin: false
      };
      this.commonService.login(loginData).subscribe((data: any) => {
        // console.log(data, 'karthik Data')
        if (data.success) {
          this.loginForm.reset();
          this.appconfig.setSessionStorage('userDetails', JSON.stringify(data.data));
          this.appconfig.setSessionStorage('token', data.token);
          this.appconfig.setSessionStorage('profileImage', data.data.profileImage);
          this.util.headerSubject.next(true);
          this.util.cartSubject.next(true);
          this.util.getValue().subscribe((response) => {
            if (response) {
              this.userDetails = JSON.parse(this.appconfig.getSessionStorage('userDetails'));
              if (this.userDetails) {

              const data = {
                "noofFields": "15",
                "email": this.userDetails.email ? this.userDetails.email : null
              }
              this.commonService.getProfilePercentage(data).subscribe((result: any) => {
                if (result.success) {
                  let profilePercentage = result.data[0].profilePercentage;
                  if (profilePercentage <= 50) {
                    this.dialogSetup();
                    this.appconfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.home);
                  }else{
                    response.userId = this.userDetails.userId
                  this.catalogService.addToCart(response).subscribe((cart: any) => {
                    if (cart.success) {
                      this.util.cartSubject.next(true);
                      this.appconfig.routeNavigation('cart/purchase');
                    } else {
                      this.appconfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.home)
                      this.toast.warning(cart.message)
                    }
                  })
                  }
                }
                else {
                  return false
                }
              });
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
      captcha: new FormControl()
    });
  }

  registerFormInitialize() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, this.gv.alphaNum30()]],
      lastName: ['', [Validators.required, this.gv.alphaNum30()]],
      email: ['', [Validators.required, this.gv.email()]],
      password: ['', [Validators.required, this.gv.passwordRegex(), Validators.minLength(8), Validators.maxLength(32)]],
      password2: ['', [Validators.required]],
      termsandConditions: [null, [Validators.requiredTrue]],
      captcha: new FormControl()
    }, {validators: this.gv.passwordMatcher()});
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

  get passwordR() {
    return this.registerForm.get('password');
  }
  get password2() {
    return this.registerForm.get('password2');
  }

  get termsandConditions() {
    return this.registerForm.get('termsandConditions');
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

        this.appconfig.setSessionStorage('userDetails', JSON.stringify(data.data));
        this.appconfig.setSessionStorage('token', data.token);
        this.appconfig.setSessionStorage('profileImage', data.data.profileImage);
        this.util.headerSubject.next(true);
        this.util.cartSubject.next(true);
        this.util.getValue().subscribe((response) => {
          if (response) {
            var userDetails = JSON.parse(this.appconfig.getSessionStorage('userDetails'));
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
