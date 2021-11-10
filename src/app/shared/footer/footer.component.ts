import { Component, OnInit } from "@angular/core";
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})

export class FooterComponent implements OnInit {
  footerData;
  constructor(public commonService: CommonService) { 

  }

  ngOnInit() {
    this.getFooterData()
  }

  getFooterData() {
    this.commonService.getFooter().subscribe((response:any)=>{
      if(response.success) {
        this.footerData = response.data.footerData;
      }
    })
  }
  
}
