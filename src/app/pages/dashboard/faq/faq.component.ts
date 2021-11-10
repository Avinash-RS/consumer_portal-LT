import { Component, OnInit } from "@angular/core";
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: "app-faq",
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.scss"]
})

export class FaqComponent implements OnInit {
  panelOpenState = false;
  dynamicData:any
  constructor(private commonService : CommonService) { 

  }

  ngOnInit() {
    this.getDetails()
  }

  getDetails() {
    this.commonService.getCertificationDetails().subscribe((response :any)=>{
      if(response.success) {
        this.dynamicData = response.data
      }
    })
  }
}
