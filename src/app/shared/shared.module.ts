import { NgModule, Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';

//Carousel Module
import { CarouselModule } from 'ngx-owl-carousel-o';

// Component imports starts
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderImageComponent } from './header-image/header-image.component';
import { DomainListComponent } from './domain-list/domain-list.component';
import { GoalsComponent } from './goals/goals.component';
import { AssessmentsListComponent } from './assessments-list/assessments-list.component';
import { PartnersListComponent } from './partners-list/partners-list.component';
import { ExaminationComponent } from './examination/examination.component';
import { DomainCardsComponent } from './domain-cards/domain-cards.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaptchaDirective } from '../directives/captcha.directive';
// Component imports ends

// import third-party module
import { AnimateOnScrollModule } from 'ng2-animate-on-scroll';

// Skeleton Loader
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BarChartComponent } from './barChart/barChart.component';
import { RecruiterComponent } from './recruiter/recruiter.component';
import { KycMandateComponent } from './kyc-mandate/kyc-mandate.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { RelateditemsComponent } from './relateditems/relateditems.component';
import { LayoutModule } from '@angular/cdk/layout';
import { FeaturedCoursesComponent } from './featured-courses/featured-courses.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HeaderImageComponent,
    DomainListComponent,
    GoalsComponent,
    AssessmentsListComponent,
    PartnersListComponent,
    ExaminationComponent,
    DomainCardsComponent,
    CaptchaDirective,
    BarChartComponent,
    RecruiterComponent,
    KycMandateComponent,
    TestimonialComponent,
    RelateditemsComponent,
    FeaturedCoursesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    AnimateOnScrollModule.forRoot(),
    NgxSkeletonLoaderModule.forRoot()
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    HeaderImageComponent,
    DomainListComponent,
    GoalsComponent,
    AssessmentsListComponent,
    PartnersListComponent,
    ExaminationComponent,
    DomainCardsComponent,
    CaptchaDirective,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BarChartComponent,
    RecruiterComponent,
    KycMandateComponent,
    TestimonialComponent,
    RelateditemsComponent,
    LayoutModule,
    FeaturedCoursesComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]

})
export class SharedModule { }
