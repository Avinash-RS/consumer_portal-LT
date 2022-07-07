import { Component, OnInit,Inject,Input } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AppConfigService } from "src/app/utils/app-config.service";
@Component({
  selector: 'app-micro-learn-certification',
  templateUrl: './micro-learn-certification.component.html',
  styleUrls: ['./micro-learn-certification.component.scss']
})
export class MicroLearnCertificationComponent implements OnInit {
  userDetails;
  @Input('courseItems') certificateData: any = {};
  constructor(public appconfig : AppConfigService) { }

  ngOnInit() {
   this.userDetails = JSON.parse(this.appconfig.getLocalStorage('userDetails'));
  }

}
