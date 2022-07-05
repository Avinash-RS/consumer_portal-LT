import { Component, OnInit, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/app/services/common.service";
import { UtilityService } from "src/app/services/utility.service";
import { AppConfigService } from "src/app/utils/app-config.service";
import { APP_CONSTANTS } from "src/app/utils/app-constants.service";
import { CatalogService } from "../../services/catalog.service"
import { environment } from '@env/environment';
import { Location } from '@angular/common';
import { SlideInOutAnimation } from '../../animations'
import Swal from 'sweetalert2';
import { LoadingService } from 'src/app/services/loading.service';
import { trigger, state, style, transition,
  animate, group
} from '@angular/animations';
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  animations: [SlideInOutAnimation,
    trigger('mobileslideInOut', [
      state('in', style({
          'height': 'calc(100vh - 74px)' 
      })),
      state('out', style({
          'height': '0px' 
      })),
      transition('in => out', [group([
          animate('600ms ease-in-out', style({
              'height': '0px'
          })),
      ]
      )]),
      transition('out => in', [group([          
          animate('600ms ease-in-out', style({
              'height': 'calc(100vh - 74px)'
          }))
      ]
      )])
  ]),]
})

export class HeaderComponent implements OnInit {
  blobToken: string = environment.blobKey;
  hoveron: boolean;
  // showMenu: boolean;
  showMenu = 'out';
  mobileshowMenu = 'out';
  registerMenu = 'out';
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
  isCourse = false;
  isCredentials = false;
  offsetFlag = true;
  productType:string = 'assessment';
  l1:any = [];
  l2:any = [];
  l3:any = [];
  l4:any = [];
  l3item;
  l1name ="";
  l2name ="";
  l3name ="";
  longdesc ="";
  l1image ="";
  megaMenuL1Data:any =[];
  megaMenuL2Data:any =[];
  noData: any;
  ispurchased:boolean = false;
  domainId: any;
  constructor(
    private appConfig: AppConfigService,
    private catalogService: CatalogService,
    private util: UtilityService,
    private commonservice: CommonService,
    public router: Router,
    private location: Location,
    private _loading: LoadingService,
    ) {
      this.profImage = this.appConfig.getLocalStorage('profileImage');
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    if(window.pageYOffset >= 10) {
      this.showMenu = 'out';
      this.mobileshowMenu = 'out';
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
    this.getCatologmenu();
    var activeMenu = localStorage.getItem('myPurchase');
    // this.isCourse = activeMenu && activeMenu == 'course';
    // this.isAssement = activeMenu && activeMenu == 'assessment';
    this.util.isEnrolled.subscribe((result:any)=>{
      if(result && this.appConfig.getLocalStorage('token')){
        this.getPurchasedCourse();
      }
      else {
        this.ispurchased = false;
      }
    });
  }
  getPurchasedCourse(){
    let param = {"userId": this.userDetails.userId, "email": this.userDetails.email, type:'All',productType:'course'};
    this.commonservice.getmyAssesments(param).subscribe((rdata:any)=>{
      if(rdata?.success && rdata?.data.length > 0) {
        this.ispurchased = true;
      }
    });
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

  mobileclick() {
    this.showMenu =  'out';
    this.mobileshowMenu =  'out';
    this.registerMenu = this.registerMenu == 'out' ? 'in' : 'out';
  }
  megaMenuClick(type) {
    if(type == 'mobileclick') {
      this.mobileshowMenu = this.mobileshowMenu == 'in' ? 'out' : 'in';
      this.l2 = this.l1[0].data;
      this.l3 = [];
    }
    else{
      this.showMenu = type == 'desktop' ? 'in' : 'out';
      this.setDefaultMenu();
    }
    this.registerMenu = 'out';
    this.assessmentsList = this.showMenu === 'in' ? true : false;
    // this.coursesList = false;
    // this.isCertified = false;
    // this.isAssement = false;
    // this.isCourse = false;
    return false;
  }
  setDefaultMenu(){    
    this.megaMenuL1Data = [];
    this.megaMenuL2Data = [];
    this.catalogMenu.forEach((element,index)=>{
      if(index == 0){
        this.productType = element.type;
        this.megaMenuL1Data  = element.data;
        element.active = true;
        element.data.forEach((childelement,childindex)=>{
          if(childindex == 0){
            this.megaMenuL2Data = childelement.children;
            childelement.active = true;
          }
          else {
            childelement.active = false;
          }
        });
      }
      else {
        element.active = false;
      }
    });
  }
  getCatologmenu(){
    this.catalogMenu=[];
    const apiParms = {
      productType:'course',
      courseOrigin:environment.userOrigin
  }
    this.catalogService.getCatalog(apiParms).subscribe((response: any) => {
      if (response.success && response.data.length > 0) {
        var courseobj = {
          "label":'Courses',
          "type":'course',
          "data" : response.data,
          "icon" :"icon-coursePlatform",
          "desc" :"Scientifically designed courses for various levels",
          "active" : true
        }
        this.catalogMenu.push(courseobj);
        // this.getAssesment();
      } else {
        this.catalogMenu = []
      }
    });
    this.l1 = this.catalogMenu;
    this.l2 = [];
    this.l3 = [];
    this.l4 = [];
    console.log(this.catalogMenu, 'catalogMenu');
  }

  getAssesment(){
    this.catalogService.getCatalog('assessment').subscribe((response: any) => {
      if (response.success && response.data.length > 0) {
        //this.catalogMenu = response.data;
        var assobj = {
          "label":'Assessments',
          "type":'assessment',
          "data" : response.data,
          "icon" :"icon-AssessmentPlatform",
          "desc" :"Scientifically designed assessments for various levels",
          "active" : false
        }
        this.catalogMenu.push(assobj)
      } else {
        this.catalogMenu = []
      }
    });
  }

  rxjsHeaderAvatarUpdate() {
    if (this.appConfig.getLocalStorage('token')) {
      this.showAvatar = true;
      this.userDetails = JSON.parse(this.appConfig.getLocalStorage('userDetails'));
      this.getPurchasedCourse();
    }
    this.util.headerSubject.subscribe((data: any) => {
      this.showAvatar = data;
      this.userDetails = JSON.parse(this.appConfig.getLocalStorage('userDetails'));
      this.profImage = this.appConfig.getLocalStorage('profileImage');
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
    this.isCourse = false;
    this.isCredentials = false;
    this.appConfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.certificationDetails);
    this.showMenu = 'out';
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
  onlineAssessment(productType) {
    this.isCertified = false;
    this.isAssement = productType == 'assessment' ? true:false;
    this.isCourse = productType == 'course' ? true:false;
    localStorage.setItem('myPurchase',productType);
    this.isCredentials = false;
    this.showMenu = 'out';
    this.mobileshowMenu = 'out';
    this.assessmentsList= false;
    this.coursesList = false;
    if(this.userDetails) {
      this.appConfig.routeNavigation('/myAssessment');
      this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ROUTES.myAssessment,{ "productType" : btoa(productType)});
    } else {
      this.isAssement = false;
      this.isCourse = false;
      this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, { fromPage: '0' });
    }
    
  }

  showCredenitals() {
    this.isCertified = false;
    this.isAssement = false;
    this.isCourse = false;
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
    this.mobileshowMenu = 'out';
    this.assessmentsList= false;
    this.coursesList = false;
    this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.home, { fromPage: btoa("viewAll"), selectedTab: btoa(value) ,productType : btoa('course')});
    this.inActiveTabs();
  }
  gotoArea(data) {
    if(data.cid == "GTA1018"){
      this.toast.warning('Coming Soon');
      return false;
    }
    this.showMenu = 'out';
    this.mobileshowMenu = 'out';
    this.assessmentsList= false;
    this.coursesList = false;
    this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.aboutCourse,{id : btoa(data?.levelIds[0]?.LevelId ? data.levelIds[0].LevelId : ''), selectedTab : btoa(data.parentId) ,productType : btoa('course')});
    this.inActiveTabs();
  }

  aboutAssessment(cid) {
    this.showMenu = 'out';
    this.mobileshowMenu = 'out';
    this.assessmentsList= false;
    this.coursesList = false;
    this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.aboutAssessment, { id: cid, selectedTab: 'All', productType : this.productType});
    this.inActiveTabs();
  }

  closeMegaMenu() {
    this.showMenu = 'out';
    this.assessmentsList= false;
    this.coursesList = false;
  }
  closeMegaMenu_() { 
    this.showMenu = 'out';
    this.mobileshowMenu = 'out';
    this.registerMenu = 'out';
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
    this.isCourse = false;
    this.isCertified = false;
    this.isCredentials = false;
  }
  navigateProfile(type){
    this.router.navigate(['/userProfile'],{queryParams:{tabtype:type}})
  }
  firstlevelClick(item){
    this.l1name=item.label;
    this.l2 = item.data;
    this.productType = item.type;
    console.log(this.l2, 'level 2')
  }
  secondlevelclick(item){
    this.l3 = item.children;
    this.l2name=item.name;
    this.l1image = item.menuImage.url;
  }

  triggerLeave(){
    if(this.showMenu == 'in'){
      this.closeMegaMenu();
    }
  }
  firstLevelHover(menu,item){
    this.megaMenuL1Data = item.data;
    this.megaMenuL2Data = this.megaMenuL1Data[0].children;
    this.productType = item.type;
    menu.forEach(element => {
      if(element.label == item.label){
        element.active = true;
      }
      else{
        element.active = false;
      }
    });
    this.megaMenuL1Data.forEach((e1,i) => {
      if(i!==0)
      {e1.active = false;}
      else{e1.active = true;}
    });
  }
  secondLevelHover(l1Data,item){
    this.domainId = item.cid;
    this.megaMenuL2Data = item?.children ? item?.children : [];
    l1Data.forEach((element)=>{
      if(element.cid == item.cid){
        element.active = true;
      }
      else{
        element.active = false;
      }
    })
  }
  ngOnDestroy() {
    localStorage.removeItem('myPurchase');
  }
  gotoCourse(){
    var ValueData = JSON.parse(this.appConfig.getLocalStorage('valueData'));
      window.open(environment.lxp_url+"?queValue="+encodeURIComponent(ValueData.queValue)+'&rpValue='+encodeURIComponent(ValueData.rpValue)+'&dpValue=microsetportal', '_self');
  }
}
