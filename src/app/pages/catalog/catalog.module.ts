import { NgModule,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogRoutingModule } from './catalog-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

//Carousel Module
import { CarouselModule } from 'ngx-owl-carousel-o';

import { ZcontentCatalogMainRouteComponent } from './zcontent-catalog-main-route/zcontent-catalog-main-route.component';
import { CatalogHomeComponent } from './catalog-home/catalog-home.component';
import { AboutAssessmentComponent } from './about-assessment/about-assessment.component';
import { AssessmentTypeComponent } from './assessment-type/assessment-type.component';
import { CertifyAssessmentComponent } from './certify-assessment/certify-assessment.component';
import { RatingStudentFeedbackComponent } from './rating-studentFeedback/rating-studentFeedback.component';
import { SearchComponent } from './search/search.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AboutCourseComponent } from './about-course/about-course.component';

@NgModule({
  declarations: [
    ZcontentCatalogMainRouteComponent, 
    CatalogHomeComponent, 
    AboutAssessmentComponent, 
    AssessmentTypeComponent, 
    CertifyAssessmentComponent,
    RatingStudentFeedbackComponent,
    SearchComponent,
    AboutCourseComponent
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    SharedModule,
    CarouselModule,
    NgxSkeletonLoaderModule
  ],
  exports : [CatalogHomeComponent,AboutAssessmentComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [
  ]
})
export class CatalogModule { }
