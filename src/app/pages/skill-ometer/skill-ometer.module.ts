import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { SkillOMeterRoutingModule } from './skill-ometer-routing.module';
import { SkillDashboardComponent } from './skillDashboard/skillDashboard.component';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  declarations: [ SkillDashboardComponent ],
  imports: [
    CommonModule,
    SkillOMeterRoutingModule,
    MaterialModule,
    FormsModule,
    NgxChartsModule
  ]
})
export class SkillOMeterModule { }
