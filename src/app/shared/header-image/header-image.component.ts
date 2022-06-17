import { Component, OnInit, Input } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from '@env/environment';
import { APP_CONSTANTS } from "src/app/utils/app-constants.service";
import { AppConfigService } from 'src/app/utils/app-config.service';
import { UtilityService } from "src/app/services/utility.service";
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-header-image',
  templateUrl: './header-image.component.html',
  styleUrls: ['./header-image.component.scss']
})
export class HeaderImageComponent implements OnInit {
  @Input('HomeBannerImage') HomeBannerImage: any;
  blobToken: string = environment.blobKey;
  showAvatar: boolean;
  userDetails: any;
  dynamicData : any
  showProgress:boolean = false;
  owlCarouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    autoplay: true,
    animateIn: 'fadeIn',
    animateOut: 'fadeOut',
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    dots: true,
    navSpeed: 5000,
    navText: ['', ''],
    nav: false,
    responsive: {
      0: {
        items: 1
      }
    }
  }
  profilePercentage:any = 0;
  constructor(private appConfig: AppConfigService, private util: UtilityService, private commonService : CommonService) { }

  ngOnInit() {
    this.rxjsHeaderAvatarUpdate();
    // this.getSliderContent()
    // this.getProfilePercentage();
    // this.showKycProgress();
  }

  navigateCatalog() {
    this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.home, { fromPage: btoa("viewAll"), selectedTab: btoa('All') ,productType : btoa('all')});
  }

  getSliderContent() {
    this.commonService.getCertificationDetails().subscribe((response :any)=>{
      if(response.success) {
        this.dynamicData = response.data
      }
    })
  }

  rxjsHeaderAvatarUpdate() {
    if (this.appConfig.getSessionStorage('token')) {
      this.showAvatar = true;
      this.userDetails = JSON.parse(this.appConfig.getSessionStorage('userDetails'));
    }
    this.util.headerSubject.subscribe((data: any) => {
      this.showAvatar = data;
      this.userDetails = JSON.parse(this.appConfig.getSessionStorage('userDetails'));
    });
  }

  gotoSkillOmeter(){
    if(this.userDetails) {
      this.appConfig.routeNavigation('skillOmeter');
    } else {      
      this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, { fromPage: '0' });
    }
  }
  showKycProgress(){
    this.util.showkycProgress.subscribe((data:any)=>{
      this.showProgress = data;
    })
  }
  getProfilePercentage(){
    if(this.appConfig.getSessionStorage('token')){
      this.showProgress = true;
      const data = {
        "noofFields":"44",
        "email" : this.userDetails.email ? this.userDetails.email :null
      }
      this.commonService.getProfilePercentage(data).subscribe((result:any)=>{
        if(result?.success){
           this.profilePercentage =  result.data[0].profilePercentage;
        }
        else{
          this.profilePercentage = 0;
        }
      });
    }
    else{
      this.showProgress = false;
    }
  }
}
