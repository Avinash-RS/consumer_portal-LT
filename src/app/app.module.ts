import { BrowserModule } from '@angular/platform-browser';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA,ErrorHandler } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { InterceptorService } from './interceptor/interceptor.service';
import { FormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { GlobalErrorHandlerService } from './global-error-handler'
// import third-party module
import { AnimateOnScrollModule } from 'ng2-animate-on-scroll';
import { BnNgIdleService } from 'bn-ng-idle';
import { BookSlotComponent } from './pages/bookSlot/bookSlot.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
// import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';

@NgModule({
  declarations: [
    AppComponent,
    BookSlotComponent
  ],
  // entryComponents: [
  //   BookSlotComponent
  // ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    SharedModule,
    CarouselModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(
      {
        timeOut: 3000,
        preventDuplicates: true,
        maxOpened:3,
        autoDismiss:true,
        progressBar:true,
        progressAnimation:'increasing',
        closeButton:true
      }
    ),
    MaterialModule,
    HttpClientModule,
    RecaptchaModule,
    AnimateOnScrollModule.forRoot(),
    NgxSkeletonLoaderModule
  ],
  providers: [BnNgIdleService,
    {
    provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService }
    // { provide: RECAPTCHA_V3_SITE_KEY, useValue: "6LfgJbYaAAAAAN1uClJ5r0UyrPzLarZpFSGaU85I" }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],

})
export class AppModule { }
