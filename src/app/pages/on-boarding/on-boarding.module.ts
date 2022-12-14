import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { OnBoardingRoutingModule } from './on-boarding-routing.module';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { OnBoardingMainRouteComponent } from './on-boarding-main-route/on-boarding-main-route.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgotPassword/forgotPassword.component';
import { CookieService } from 'ngx-cookie-service';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

@NgModule({
  declarations: [
    OnBoardingMainRouteComponent,
    LoginComponent,
    ForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    OnBoardingRoutingModule,
    SharedModule,
    MaterialModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    FilterPipeModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [
    CookieService
  ]
})
export class OnBoardingModule { }
