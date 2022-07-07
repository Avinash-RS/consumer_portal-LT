import { Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Gtag } from 'angular-gtag';
import { AppConfigService } from '../utils/app-config.service';
import * as CryptoJS from 'crypto-js';

@Injectable({

providedIn: 'root'

})

export class GoogleAnalyticsService {
secretKey = "(!@#Passcode!@#)";
constructor(private gtag: Gtag,
            private router: Router,
            private appConfig: AppConfigService,
            ) { }

getUserid(){
  let user_id = null;
    var userDetails = JSON.parse(this.appConfig.getLocalStorage('userDetails'));
    if (userDetails?.userId) {
       user_id = CryptoJS.AES.decrypt(userDetails.userId, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
    }
    return user_id
}
gaSetPage(title: string,userProps?:any) {
this.gtag.pageview({
    page_title: title,
    page_path: this.router.url,
    page_location: window.location.href,
    userID:this.getUserid(),
    send_to: environment.gaMeasureId
  });
  if(userProps){
    this.gaSetUserProps(userProps);
  }
}

// Trigger Event with params
gaEventTrgr(eventName, eventDesc, category, params:any){
  this.gtag.event(eventName, {
    event_category: category,
    event_label: eventDesc,
    ... params
  });
}

// set user properties
gaSetUserProps(params){
  let def_data = {userID:this.getUserid(), ... params}
  this.gtag.set(def_data);
}
}
