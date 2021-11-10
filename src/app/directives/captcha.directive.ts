import { Directive, Input, ElementRef, OnInit, AfterViewInit, NgZone, Injector, forwardRef } from '@angular/core';
import { FormControl, ControlValueAccessor, NgControl, Validators, NG_VALUE_ACCESSOR, AbstractControl } from '@angular/forms';
import { CommonService } from '../services/common.service';

declare const grecaptcha : any;
declare global {
  interface Window {
    grecaptcha : any;
    reCaptchaLoad : () => void
  }
}
@Directive({
  selector: '[nbRecaptcha]',
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CaptchaDirective),
      multi: true
    }
  ]
})

  /*
 //  In template, inside reactive forms
                              <div nbRecaptcha formControlName="captcha"></div>
                            <ng-container *ngIf="captcha.invalid && captcha.touched">
                                <mat-error *ngIf="captcha.errors?.required" class="error">{{'Please fill in Captcha'}}</mat-error>
                                <mat-error *ngIf="captcha.errors?.invalid" class="error">{{'Invalid Captcha'}}</mat-error>
                            </ng-container>    


  // In ts,
  loginFormInitialize() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, this.gv.email()]],
      password: ['', [Validators.required]],
      // Below line is for captcha form control
      captcha: new FormControl()
    });
  }

  // captcha form getter
    get captcha() {
    return this.loginForm.get('captcha');
  }
  */

export class CaptchaDirective implements OnInit, AfterViewInit, ControlValueAccessor {

  control: FormControl;
  
  key : string = '6Lf-qfEcAAAAAH2zsrdDz1K6DmUOHjgHzGmH3PN7';
  @Input() lang : string;
  
  secretKey = '6Lf-qfEcAAAAALmNZCwnHImQdYYjnq5sOqkjwebs';
  private onChange: (value: string) => void;
  private onTouched: (value: string) => void;
  private widgetId : number;

  constructor( private element : ElementRef, private  ngZone : NgZone, private injector : Injector, private commonservice: CommonService) { }

  ngOnInit() {
    // alert('adad');
    this.registerReCaptchaCallback();
    this.addScript();
  }

  ngAfterViewInit() {
    this.control = this.injector.get(NgControl).control as FormControl;
    this.setValidator();
  }
  
  addScript() {
    let script = document.createElement('script');
    const lang = this.lang ? '&hl=' + this.lang : '';
    script.src = `https://www.google.com/recaptcha/api.js?onload=reCaptchaLoad&render=explicit${lang}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  onExpired() {
    this.ngZone.run(() => {
      this.onChange(null);
      this.onTouched(null);
    });
  }
  
  onSuccess( token : string ) {
    this.ngZone.run(() => {
      this.verifyToken(token);
      this.onChange(token);
      this.onTouched(token);
    });
  }

  writeValue( obj : any ) : void {
  }

  registerOnChange( fn : any ) : void {
    this.onChange = fn;
  }

  registerOnTouched( fn : any ) : void {
    this.onTouched = fn;
  }

  
  private setValidator() {
    this.control.setValidators(Validators.required);
    this.control.updateValueAndValidity();
  }

  registerReCaptchaCallback() {
    window.reCaptchaLoad = () => {
      const config = {
        'sitekey': this.key,
        'callback': this.onSuccess.bind(this),
        'expired-callback': this.onExpired.bind(this)
      };
      this.widgetId = this.render(this.element.nativeElement, config);
    };
  }

  verifyToken( token : string ) {
    // this.control.setAsyncValidators(this.commonservice.validateToken(this.secretKey, token)); // Server side http call function, uncomment if u need to implement server side captcha verfication.
    this.control.updateValueAndValidity();
  }

  private render( element : HTMLElement, config ) : number {
    return grecaptcha.render(element, config);
  }
}
