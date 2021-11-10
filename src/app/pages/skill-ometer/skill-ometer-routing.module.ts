import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { APP_CONSTANTS } from 'src/app/utils/app-constants.service';
import { SkillDashboardComponent } from './skillDashboard/skillDashboard.component';

const routes: Routes = [

  {
    path: APP_CONSTANTS.ENDPOINTS.skillOMeter.dashBoard, component: SkillDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillOMeterRoutingModule { }
