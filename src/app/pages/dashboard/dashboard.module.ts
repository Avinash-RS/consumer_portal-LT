import { NgModule,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { HomeComponent } from './home/home.component';
import { CertificationDetailsComponent } from './certification-details/certification-details.component';
import { FaqComponent } from './faq/faq.component';
import { UserprofileComponent } from './profile/userprofile.component';
import { ZcontentMainRouteComponent } from './zcontent-main-route/zcontent-main-route.component';
import { MyAssessmentComponent } from './myAssessment/myAssessment.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { KYCinfoComponent } from './kycinfo/kycinfo.component';
import { KycPersonalComponent } from './kycinfo/kyc-personal/kyc-personal.component';
import { KycContactComponent } from './kycinfo/kyc-contact/kyc-contact.component';
import { KycPassportComponent } from './kycinfo/kyc-passport/kyc-passport.component';
import { KycEducationComponent } from './kycinfo/kyc-education/kyc-education.component';
import { KycQuestionComponent } from './kycinfo/kyc-question/kyc-question.component';
import { KycPreviewComponent } from './kycinfo/kyc-preview/kyc-preview.component';


@NgModule({
  declarations: [
    ZcontentMainRouteComponent,
    HomeComponent,
    CertificationDetailsComponent,
    FaqComponent,
    UserprofileComponent,
    MyAssessmentComponent,
    KYCinfoComponent,
    KycPersonalComponent,
    KycContactComponent,
    KycPassportComponent,
    KycEducationComponent,
    KycQuestionComponent,
    KycPreviewComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    NgxSkeletonLoaderModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [
  ]
})
export class DashboardModule { }
