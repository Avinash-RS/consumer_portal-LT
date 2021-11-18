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
  constructor(private util: UtilityService, private dialog: MatDialog, public commonService: CommonService, private cookieService: CookieService, private router: Router, private appconfig: AppConfigService, private catalogService: CatalogService, public toast: ToastrService,) {

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
          //this.router.navigate(['/assessmentHome'])
        }
      //console.log('redirect')
     // this.router.navigate(['/assessmentHome'])
      //window.location.href="https://certification.lntiggnite.com/assessmentHome"
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


  getStaticHomeData() {
    this.commonService.getStaticDataHome().subscribe((response: any) => {
      if (response.success) {
        this.commonData = response.data;
      }
    })
  }
  verifySsotoken(token) {
    this.commonService.verifySsotoken(token).subscribe((response: any) => {
      if (response && response.token) {
        var decoded = jwt_decode(token);
        console.log(decoded);

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

          this.appconfig.setSessionStorage('userDetails', JSON.stringify(data.data));
          this.appconfig.setSessionStorage('token', data.token);
          this.appconfig.setSessionStorage('profileImage', data.data.profileImage);
          this.util.headerSubject.next(true);
          this.util.cartSubject.next(true);
          this.util.getValue().subscribe((response) => {
            if (response) {
              this.userDetails = JSON.parse(this.appconfig.getSessionStorage('userDetails'));
              if (this.userDetails) {

              const data = {
                "noofFields": "15",
                "email": this.userDetails.email ? this.userDetails.email : null
              }
              this.commonService.getProfilePercentage(data).subscribe((result: any) => {
                if (result.success) {
                  let profilePercentage = result.data[0].profilePercentage;
                  if (profilePercentage <= 50) {
                    this.dialogSetup();
                    this.appconfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.home);
                  }else{
                    response.userId = this.userDetails.userId
                  this.catalogService.addToCart(response).subscribe((cart: any) => {
                    if (cart.success) {
                      this.util.cartSubject.next(true);
                      this.appconfig.routeNavigation('cart/purchase');
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
              this.appconfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.home);
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
}
