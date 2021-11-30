import { Component, OnInit, HostListener } from "@angular/core";
import { Router,NavigationEnd } from "@angular/router";
import { CommonService } from "src/app/services/common.service";
import { UtilityService } from "src/app/services/utility.service";
import { AppConfigService } from "src/app/utils/app-config.service";
import { APP_CONSTANTS } from "src/app/utils/app-constants.service";
import { CatalogService } from "../../services/catalog.service"
import { environment } from '@env/environment';
import { Location } from '@angular/common';
import { SlideInOutAnimation } from '../../animations'
import Swal from 'sweetalert2';
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  animations: SlideInOutAnimation
})

export class HeaderComponent implements OnInit {
  blobToken: string = environment.blobKey;
  hoveron: boolean;
  // showMenu: boolean;
  showMenu = 'out';
  showCourseMenu = 'out';
  assessmentsList:boolean = false;
  coursesList:boolean = false;
  menu_tab: boolean = false;
  catalogMenu = [];
  showAvatar: boolean;
  userDetails: any;
  cartCount = 0;
  firstTabValue = { 'name': 'All', 'cid': 'All' }
  selectedTab;
  profImage: any;
  isCertified = false;
  isAssement = false;
  isCredentials = false;
  offsetFlag = true;
  productType:string = 'assessment';
  constructor(
    private appConfig: AppConfigService,
    private catalogService: CatalogService,
    private util: UtilityService,
    private commonservice: CommonService,
    public router: Router,
    private location: Location
    ) {
      this.profImage = this.appConfig.getSessionStorage('profileImage');
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    if(window.pageYOffset >= 10) {
      this.showMenu = 'out';
      this.showCourseMenu = 'out';
      this.assessmentsList= false;
      this.coursesList = false;
    }
  }

  ngOnInit() {
    this.rxjsHeaderAvatarUpdate();
    this.getCart();
    this.util.cartSubject.subscribe((data: any) => {
      if (data) {
        this.getCart();
      } else{
        this.cartCount = 0
      }
    });
    this.getUrl()
  }

  getUrl(){
      var url = this.location.path()
      if(url == '/certificationDetails') {
        this.isCertified = true;
      } else if(url == '/faq') {
        this.isCredentials = true;
      } else if (url == '/myAssessment'){
        this.isAssement = true;
      }
    
  }
  megaMenuClick() {
    //this.productType = 'assessment';
    this.showMenu = this.showMenu === 'out' ? 'in' : 'out';
    this.showCourseMenu = 'out';
    this.assessmentsList = this.showMenu === 'in' ? true : false;
    this.coursesList = false;
    this.isCertified = false;
    this.isAssement = false;
    
    if(this.showMenu == 'in'){
      this.catalogMenu=[];
      this.catalogService.getCatalog('assessment').subscribe((response: any) => {
        // debugger;
        if (response.success && response.data.length > 0) {
          //this.catalogMenu = response.data;
          var assobj = {
            "label":'Assessment',
            "type":'assessment',
            "data" : response.data
          }
          this.catalogMenu.push(assobj)
        } else {
          this.catalogMenu = []
        }
      });
      this.catalogService.getCatalog('course').subscribe((response: any) => {
        // debugger;
        if (response.success && response.data.length > 0) {
          //this.catalogMenu = response.data;
          var courseobj = {
            "label":'Course',
            "type":'course',
            "data" : response.data
          }
          this.catalogMenu.push(courseobj)
        } else {
          this.catalogMenu = []
        }
      });
    }
  }
  // courseMenuClick(){
  //   this.productType = 'course';
  //   this.showCourseMenu = this.showCourseMenu === 'out' ? 'in' : 'out';
  //   this.showMenu = 'out';
  //   this.coursesList = this.showCourseMenu === 'in' ? true : false;
  //   this.assessmentsList = false;
  //   this.isCertified = false;
  //   this.isAssement = false;
  //   this.catalogService.getCatalog(this.productType).subscribe((response: any) => {
  //     if (response.success && response.data.length > 0) {
  //       this.catalogMenu = response.data;
  //     } else {
  //       this.catalogMenu = []
  //     }
  //   })
  // }
  rxjsHeaderAvatarUpdate() {
    if (this.appConfig.getSessionStorage('token')) {
      this.showAvatar = true;
      this.userDetails = JSON.parse(this.appConfig.getSessionStorage('userDetails'));
    }
    this.util.headerSubject.subscribe((data: any) => {
      this.showAvatar = data;
      this.userDetails = JSON.parse(this.appConfig.getSessionStorage('userDetails'));
      this.profImage = this.appConfig.getSessionStorage('profileImage');
    });
  }

  openOnBoard(value) {
    this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, { fromPage: value });
    this.inActiveTabs();
  }

  homepage() {
    this.inActiveTabs();
    this.appConfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.home);
  }

  getCertified() {
    this.isCertified = true;
    this.isAssement = false;
    this.isCredentials = false;
    this.appConfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.certificationDetails);
    this.showMenu = 'out';
    this.showCourseMenu = 'out';
    this.assessmentsList= false;
    this.coursesList = false;
  }
  
  editProfile(){
    this.appConfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.userprofile);
    this.inActiveTabs();
  }

  getFAQ() {
    this.appConfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.faq);
  }

  getSearch() {
    this.appConfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.catalog.search);
  }
  onlineAssessment() {
    this.isCertified = false;
    this.isAssement = true;
    this.isCredentials = false;
    this.showMenu = 'out';
    this.showCourseMenu = 'out';
    this.assessmentsList= false;
    this.coursesList = false;
    if(this.userDetails) {
      this.appConfig.routeNavigation('/myAssessment');
    } else {
      this.isAssement = false;
      this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, { fromPage: '0' });
    }
    
  }

  showCredenitals() {
    this.isCertified = false;
    this.isAssement = false;
    this.isCredentials = true;
  }
  openCart() {
    if(this.userDetails) {
      this.appConfig.routeNavigation('cart/purchase');
    } else {
      this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, { fromPage: '0' });
    }
    
    this.inActiveTabs();
  }

  logout() {
    Swal.fire({
      customClass: {
        container: 'swalClass',
      },
      title: 'Are you sure you want to logout?',
      showCancelButton: true,
      confirmButtonColor: '#ffffff',
      cancelButtonColor: '#ffffff',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if(result.isConfirmed){
        this.commonservice.logout();
        this.util.showkycProgress.next(false);
        this.util.cartSubject.next(false);
        this.cartCount = 0;
        this.inActiveTabs();
        // this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, { fromPage: '0' });
        this.appConfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.home);
      }
    });
  }

  catalogHome(value) {
    this.showMenu = 'out';
    this.showCourseMenu = 'out';
    this.assessmentsList= false;
    this.coursesList = false;
    this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.home, { fromPage: "viewAll", selectedTab: value });
    this.inActiveTabs();
  }
  gotoArea(data,type) {
    this.productType = type;
    this.showMenu = 'out';
    this.showCourseMenu = 'out';
    this.assessmentsList= false;
    this.coursesList = false;
    this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.aboutAssessment,{id : data.cid, selectedTab : data.parentId ,productType : this.productType});
    this.inActiveTabs();
  }

  aboutAssessment(cid) {
    this.showMenu = 'out';
    this.showCourseMenu = 'out';
    this.assessmentsList= false;
    this.coursesList = false;
    this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.aboutAssessment, { id: cid, selectedTab: 'All', productType : this.productType});
    this.inActiveTabs();
  }

  closeMegaMenu() {
    // this.showMenu = false;
    this.showMenu = 'out';
    this.showCourseMenu = 'out';
    this.assessmentsList= false;
    this.coursesList = false;
  }
  closeMegaMenu_() { 
    this.showMenu = 'out';
    this.showCourseMenu ='out';
    this.assessmentsList= false;
    this.coursesList = false;
  }

  search_sec() {
    this.menu_tab = !this.menu_tab;
  }
  getCart() {
    if (this.userDetails) {
      var params = {
        "userId": this.userDetails.userId
      }
      this.catalogService.getCartCont(params).subscribe((response: any) => {
        if (response.success) {
          this.cartCount = response.data
        } else {
          this.cartCount = 0
        }
      })
    }
  }
  inActiveTabs() {
    this.isAssement = false;
    this.isCertified = false;
    this.isCredentials = false;
  }
  navigateProfile(type){
    this.router.navigate(['/userProfile'],{queryParams:{tabtype:type}})
  }
}
