import { Component, OnInit } from "@angular/core";
import { CommonService } from 'src/app/services/common.service';
import * as CryptoJS from 'crypto-js';
import { environment } from '@env/environment';
@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})

export class FooterComponent implements OnInit {
  footerData;
  secretKey = "(!@#Passcode!@#)";
  constructor(public commonService: CommonService) { 

  }

  ngOnInit() {
    this.getFooterData()
  }

  getFooterData() {
    this.commonService.getFooter({userOrigin:CryptoJS.AES.encrypt(environment.userOrigin, this.secretKey.trim()).toString()}).subscribe((response:any)=>{
      if(response.success) {
        this.footerData = response.data.footerData;
      }
    })
  }
  
}
