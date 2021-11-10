import { Component, OnInit } from "@angular/core";
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: "app-certification-details",
  templateUrl: "./certification-details.component.html",
  styleUrls: ["./certification-details.component.scss"]
})

export class CertificationDetailsComponent implements OnInit {
  certificationdata;

  constructor(public commonService: CommonService) { 

  }

  ngOnInit() {
    this.getDetails()

  }

  getDetails() {
    this.commonService.getCertificationDetails().subscribe((response :any)=>{
      if(response.success) {
        this.certificationdata = response.data
      }
    })
  }

  getLink(stepDataName){
    if(stepDataName == "BUILD YOUR PROFILE"){
      return "/userProfile"
    }else if(stepDataName == "BOOK AN ASSESSMENT"){
      return "/catalog/catalogHome?fromPage=viewAll&selectedTab=All"
    }else{
      return "/userProfile?tab=My Skill Zone"
    }
    
  }
}
