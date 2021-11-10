import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CertificationDetailsComponent } from './certification-details/certification-details.component';
import { FaqComponent } from './faq/faq.component';
import { UserprofileComponent } from './profile/userprofile.component';
import { ZcontentMainRouteComponent } from './zcontent-main-route/zcontent-main-route.component';
import { APP_CONSTANTS } from 'src/app/utils/app-constants.service';
import { MyAssessmentComponent } from './myAssessment/myAssessment.component';
import { CartCanLoadGuard } from 'src/app/gaurds/canload/cart-can-load.guard';

const routes: Routes = [
  {path: '', component: ZcontentMainRouteComponent, children: [
    {
      path: APP_CONSTANTS.ROUTES.home, component: HomeComponent,
    },
    {
      path: '', redirectTo: APP_CONSTANTS.ROUTES.home,
    },
    {
      path: APP_CONSTANTS.ROUTES.certificationDetails, component: CertificationDetailsComponent,
    },
    {
      path: APP_CONSTANTS.ROUTES.faq, component: FaqComponent,
    },
    {
      path: APP_CONSTANTS.ROUTES.userprofile, component: UserprofileComponent,
    },
    {
      path: APP_CONSTANTS.ROUTES.myAssessment, component: MyAssessmentComponent, canLoad: [CartCanLoadGuard]
    },
    {
      path: '', redirectTo: APP_CONSTANTS.ROUTES.certificationDetails,
    }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
