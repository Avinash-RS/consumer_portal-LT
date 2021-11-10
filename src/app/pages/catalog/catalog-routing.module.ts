import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZcontentCatalogMainRouteComponent } from './zcontent-catalog-main-route/zcontent-catalog-main-route.component'
import { CatalogHomeComponent } from './catalog-home/catalog-home.component';
import { AboutAssessmentComponent } from './about-assessment/about-assessment.component';
import { AssessmentTypeComponent } from './assessment-type/assessment-type.component';
import { CertifyAssessmentComponent } from './certify-assessment/certify-assessment.component';
import { SearchComponent } from './search/search.component';
import { APP_CONSTANTS } from 'src/app/utils/app-constants.service';

const routes: Routes = [
  {path: '', component: ZcontentCatalogMainRouteComponent, children: [
    {
      path: APP_CONSTANTS.ROUTES.catalog.catalogHome, component: CatalogHomeComponent,
    },
    {
      path: APP_CONSTANTS.ROUTES.catalog.aboutAssessment, component: AboutAssessmentComponent,
    },
    {
      path: APP_CONSTANTS.ROUTES.catalog.assessmentType, component: AssessmentTypeComponent,
    },
    {
      path: APP_CONSTANTS.ROUTES.catalog.certifyAssessment, component: CertifyAssessmentComponent,
    },
    {
      path: APP_CONSTANTS.ROUTES.catalog.search, component: SearchComponent,
    },
    {
      path: '' , redirectTo: APP_CONSTANTS.ROUTES.catalog.catalogHome
    }
    
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }
