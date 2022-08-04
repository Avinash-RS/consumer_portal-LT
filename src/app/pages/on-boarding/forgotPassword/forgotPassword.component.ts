import { Component, OnInit, ViewChild} from "@angular/core";
import { CommonService } from "src/app/services/common.service";
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router} from "@angular/router";
import * as bcrypt from 'bcryptjs';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AppConfigService } from "src/app/utils/app-config.service";
import { GlobalValidatorsService } from "src/app/validators/global-validators.service";
import { APP_CONSTANTS } from "src/app/utils/app-constants.service";
import { environment } from "@env/environment";
import { RecaptchaErrorParameters } from "ng-recaptcha";
import * as CryptoJS from 'crypto-js';
@Component({
  selector: "app-forgotPassword",
  templateUrl: "./forgotPassword.component.html",
  styleUrls: ["./forgotPassword.component.scss"]
})

export class ForgotPasswordComponent implements OnInit {
  hide = true;
  hide1 = true;
  secretKey = "(!@#Passcode!@#)";
  forgetPwdForm: FormGroup;
  resetPwdForm: FormGroup;
  mailId: string
  viewObj: any = {
    landing: false,
    mailSent: false,
    setPassword: false,
    pwdSetSuccess: false,
    linkExp: false,
    reset(){
      this.landing = false;
      this.mailSent = false;
      this.setPassword = false;
      this.pwdSetSuccess = false;
      this.linkExp = false;
    }
  }
  userEmail: string;
  pwdSecretKey: void;
  recaptchaStr = '';
  siteKey: any = environment.captachaSiteKey;
  browserRefresh;
  @ViewChild('captchaRef',{ static: false }) captchaRef;
  constructor(
    public commonService: CommonService,
    public toast: ToastrService,
    private fb: FormBuilder,
    private appconfig: AppConfigService,
    public gv: GlobalValidatorsService,
    public route: ActivatedRoute,
    public router: Router,

    ) { 
      var set = this.appconfig.getSessionStorage('onsucess')
      if(set){
        this.appconfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, { fromPage: this.commonService.encrypt('0',this.secretKey) });
      }
      this.route.queryParams.subscribe(params => {
        if (params.setPwd && params.email) {
          this.userEmail =  CryptoJS.AES.decrypt(params.email.trim(), this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
          this.pwdSecretKey = params.setPwd;
          this.displayController('setPassword');
          this.resetPwdFormInitialize();
        } else if(params.expired){
          this.displayController('linkExp');
        }else {
          this.displayController("landing");
        }
      });

  }

  ngOnInit() {
    this.forgetPwdFormInitialize();
    setTimeout(()=>{
      this.captchaRef.reset();
    },1000);
  }
  nextclicker(){
    this.appconfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.forgetpwd, {setPwd: 'kld12sdf4l12sdf23', email: this.forgetPwdForm.value.email});
  }
  displayController(input){
    switch (input) {
      case "landing":
        this.viewObj.reset()
        this.viewObj.landing = true;
        break;
      case "mailSent":
        this.viewObj.reset()
        this.viewObj.mailSent = true;
        break;
      case "setPassword":
        this.viewObj.reset()
        this.viewObj.setPassword = true;
        break;
      case "pwdSuccess":
        this.viewObj.reset()
        this.viewObj.pwdSuccess = true;
        this.appconfig.setSessionStorage('onsucess',true)

        break;
      case "linkExp":
        this.viewObj.reset()
        this.viewObj.linkExp = true;
        break;
      default:
        break;
    }
  }
  checkCaptcha(captchaSignIn){
    if (this.recaptchaStr) {
      captchaSignIn.reset();
  }
  captchaSignIn.execute();
  }
  resolvedSubmit(captchaSignInResponse: string){
    this.recaptchaStr = captchaSignInResponse;
    if (this.recaptchaStr) {
      if( this.viewObj.setPassword){
        this.setNewPassword();
      }
      else{
        this.sendLinkToMail();
      }
    }
  }
  onError(errorDetails: RecaptchaErrorParameters): void {
  }
  // this sends mail to user
  sendLinkToMail(){
    if (this.forgetPwdForm.valid){
      var encryptedname = CryptoJS.AES.encrypt(this.forgetPwdForm.value.email.toLowerCase().trim(), this.secretKey.trim()).toString();
      let data = {
        "email" : encryptedname,
        "badgeRequest" : this.recaptchaStr,
        // "badgeRequest" : "microsetportal",
       }
      this.commonService.fogetPasswordEmail(data).subscribe((resp: any) => {
        if (resp.success){
          this.toast.success(resp.message)
          this.displayController("mailSent")
        }else{
          this.toast.error(resp.message);
          //this.toast.error("Email id does not exist");
        }
      })
    }else{
      this.gv.validateAllFields(this.forgetPwdForm);
    }    
  }

  // set new password
  setNewPassword(){    
    this.gv.cleanForm(this.resetPwdForm);
    if (this.resetPwdForm.valid){
        // const salt = bcrypt.genSaltSync(10);
        // const pass = bcrypt.hashSync(this.resetPwdForm.value.password, salt);
        var encryptedname = CryptoJS.AES.encrypt(this.userEmail.toLowerCase().trim(), this.secretKey.trim()).toString();
        var encryptedpassword = CryptoJS.AES.encrypt(this.resetPwdForm.value.password.trim(), this.secretKey.trim()).toString();
        let data = {"email" : encryptedname, "password" : encryptedpassword, "userSecretkey":this.pwdSecretKey , "badgeRequest" : this.recaptchaStr}
        this.commonService.resetPassword(data).subscribe((resp: any) => {
          if (resp.success){
            this.toast.success(resp.message)
            this.displayController("pwdSuccess");
          }else{
            this.toast.error(resp.message);
          }
        })  
    }else{
      this.gv.validateAllFields(this.resetPwdForm);
    }
  }

  redirectLogin() {
    this.appconfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, {fromPage: this.commonService.encrypt('0',this.secretKey)});
  }

  forgetPwdFormInitialize() {
    this.forgetPwdForm = this.fb.group({
      email: ['', [Validators.required, this.gv.email()]],
      captcha: new FormControl()
    });
  }

  resetPwdFormInitialize() {
    this.resetPwdForm = this.fb.group({
      email: [{value: this.userEmail, disabled: true}, [Validators.required, this.gv.email()]],
      password: ['', [Validators.required, this.gv.passwordRegex(), Validators.minLength(8), Validators.maxLength(32)]],
      password2: ['', [Validators.required]],
      captcha: new FormControl(),
    }, {validators: this.gv.passwordMatcher()});
  }


  // Form getters

  // Forget password form getter
  get email() {
    return this.forgetPwdForm.get('email');
  }
  get captcha() {
    return this.forgetPwdForm.get('captcha');
  }

  // Reset password form getter
  get emailR() {
    return this.resetPwdForm.get('email');
  }

  get password() {
    return this.resetPwdForm.get('password');
  }

  get password2() {
    return this.resetPwdForm.get('password2');
  }

  get captchaR() {
    return this.resetPwdForm.get('captcha');
  }


}
