import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { UtilityService } from 'src/app/services/utility.service';
import { CommonService } from 'src/app/services/common.service';
import { CookieService } from 'ngx-cookie-service';
import * as qs from 'querystring';
import jwt_decode from 'jwt-decode';
import { Router } from "@angular/router"
import { AppConfigService } from 'src/app/utils/app-config.service';
import { CatalogService } from "../../../services/catalog.service";
import { APP_CONSTANTS } from 'src/app/utils/app-constants.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from "@angular/material/dialog";
import { OwlOptions } from "ngx-owl-carousel-o";
import * as CryptoJS from 'crypto-js';
import { environment } from '@env/environment';
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})

export class HomeComponent implements OnInit {
  @ViewChild('kycmandate', { static: false }) matDialogRef: TemplateRef<any>;
  commonData: any;
  showdialog: boolean = false;
  userDetails: any;
  HomeBannerImage = [
    1,2,3,4
  ];
activeButton = '';
secretKey = "(!@#Passcode!@#)";
testimonialOptions: OwlOptions = {
  loop: true,
  mouseDrag: false,
  touchDrag: false,
  pullDrag: false,
  dots: true,
  navSpeed: 700,
  margin: 30,
  autoplay: true,
  autoplayTimeout: 4000,
  autoplayHoverPause: true,
  center: true,
  navText: ["<i class='icon-Back'></i>", "<i class='icon-right-next'></i>"],
  nav: true,
  responsive: {
    0: {
      items: 1
    },
    500: {
      items: 1
    },
    650: {
      items: 3
    },
    1024: {
      items: 3
    }
  }
}
  constructor(private util: UtilityService, private dialog: MatDialog, public commonService: CommonService, private cookieService: CookieService, private router: Router, 
    private appConfig: AppConfigService, private catalogService: CatalogService, public toast: ToastrService,) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => {
        return false;
      };

  }

  ngOnInit() {
    // this.util.setValue(false);
    this.getStaticHomeData();
    /*const params = qs.parse(window.location.search.substring(1));
    const email = qs.parse(window.location.search.substring(2));
    const password = qs.parse(window.location.search.substring(3));
    if(params.ssoToken){
      this.cookieService.set('isLoggedIn','true')
      //this.verifySsotoken(params.ssoToken)
    }
    if(!this.cookieService.get('isLoggedIn')){
      window.location.href = "http://52.172.236.38:3015/simplesso/login?serviceURL="+location.origin;
    }else{
      if(!this.cookieService.get('isLoggedInFunc')){
        this.login(email.email,password.password)
        this.cookieService.set('isLoggedInFunc','true')
      }else{
        console.log('testing')
          // window.location.href = "http://52.172.236.38:3015/simplesso/login?serviceURL="+location.origin;
          // window.location.reload(false)
          // this.login(email.email,password.password)
          //this.router.navigate(['/Home'])
        }
      //console.log('redirect')
     // this.router.navigate(['/Home'])
      //window.location.href="https://certification.lntiggnite.com/Home"
    }*/
  }

  // ngAfterViewInit() {
  //   this.openMandate()
  // }
  dialogSetup(){
    if (this.showdialog) {
      const valdat = this.dialog.open(this.matDialogRef, {
        width: '400px',
        height: '400px',
        autoFocus: true,
        closeOnNavigation: true,
        disableClose: true,
        panelClass: 'popupModalContainerForForms'
      });
    }
  }

  showPhase(carrerData,activeData){
    // this.activeButton = event;
    carrerData.forEach(element => {
     if(element.id == activeData?.id){
      element.isActive = true;
     }
     else {
      element.isActive = false;
     }
    });
  }

  getStaticHomeData() {
    this.commonService.getStaticDataHome({userOrigin:CryptoJS.AES.encrypt(environment.userOrigin, this.secretKey.trim()).toString()}).subscribe((response: any) => {
      if (response.success) {
        this.commonData = response.data;
      }
    })
  }
  verifySsotoken(token) {
    this.commonService.verifySsotoken(token).subscribe((response: any) => {
      if (response && response.token) {
        var decoded = jwt_decode(token);
        this.cookieService.set('isLoggedIn', 'true')
      }
    })
  }
  login(email, password) {
    if (email && password) {
      let loginData = {
        email: email,
        password: password,
        isAdmin: false
      };
      console.log(loginData)
      this.commonService.login(loginData).subscribe((data: any) => {
        // console.log(data, 'karthik Data')
        if (data.success) {

          this.appConfig.setLocalStorage('userDetails', JSON.stringify(data.data));
          this.appConfig.setLocalStorage('token', data.token);
          this.appConfig.setLocalStorage('profileImage', data.data.profileImage);
          this.util.headerSubject.next(true);
          this.util.cartSubject.next(true);
          this.util.getValue().subscribe((response) => {
            if (response) {
              this.userDetails = JSON.parse(this.appConfig.getLocalStorage('userDetails'));
              if (this.userDetails) {

              const data = {
                "noofFields": "44",
                "email": this.userDetails.email ? this.userDetails.email : null
              }
              this.commonService.getProfilePercentage(data).subscribe((result: any) => {
                if (result?.success) {
                  //let profilePercentage = result.data[0].profilePercentage;
                  let KYCFlag = result.data[0].KYCMandFlag ? result.data[0].KYCMandFlag : 0;
                  if (KYCFlag == 0) {
                    this.dialogSetup();
                    this.appConfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.home);
                  }else{
                    response.userId = this.userDetails.userId
                  this.catalogService.addToCart(response).subscribe((cart: any) => {
                    if (cart.success) {
                      this.util.cartSubject.next(true);
                      this.appConfig.routeNavigation('cart/purchase');
                    } else {
                      this.toast.warning('Something went wrong')
                    }
                  })
                  }
                }
                else {

                }
              });
                //   this.cookieService.set('isLoggedIn','true')
              }
            } else {
              this.appConfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.home);
            }
          })
        } else {
          this.toast.error(data.message);
        }
      });
    } else {
      console.log('trying to login ')
    }
  }
  navigateCatalog() {
    this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.home, { fromPage: btoa("viewAll"), selectedTab: btoa('All') ,productType : btoa('all')});
  }
}
