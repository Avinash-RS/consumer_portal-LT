import { Component, Input, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-kycinfo',
  templateUrl: './kycinfo.component.html',
  styleUrls: ['./kycinfo.component.scss']
})
export class KYCinfoComponent implements OnInit {

  @Input() selectedmenu;
  constructor() { }

  ngOnInit(){
    
  }



}
