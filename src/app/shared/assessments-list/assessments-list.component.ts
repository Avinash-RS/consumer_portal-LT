import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from "@angular/router"
import { ActivatedRoute } from '@angular/router';
import { AppConfigService } from 'src/app/utils/app-config.service';
import { APP_CONSTANTS } from 'src/app/utils/app-constants.service';
import { CatalogService } from "../../services/catalog.service"
import { environment } from '@env/environment';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { SlideIn } from '../../animations';
import {
  BreakpointObserver,
  BreakpointState
} from '@angular/cdk/layout';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { UtilityService } from 'src/app/services/utility.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-assessments-list',
  templateUrl: './assessments-list.component.html',
  styleUrls: ['./assessments-list.component.scss'],
  animations: SlideIn
})
export class AssessmentsListComponent implements OnInit {

  @ViewChild('allCourses', { read: DragScrollComponent }) ds: DragScrollComponent;
  leftNavDisabled = false;
  rightNavDisabled = false;
  isActiveAll = true;
  mainTabSelected = 0;
  tabValues;
  pageNumber = 0;
  selectedTab;
  fromTab = 'All'
  firstTabValue = { 'name': 'All', 'cid': 'All' }
  viewMore = true;
  areaCards = [];
  noDataFound;
  noDataSkeleton;
  skletonFiller:any=[].fill(8)
  blobToken: string = environment.blobKey;
  public destroyed = new Subject<any>();
  // subscriberdata: any;
  productType:string = 'course';
  filteredTab:string = 'all';
  filterTabs = [
    {label:"All",value:"all"},
    {label:"Course",value:"course"},
    {label:"Assessments",value:"assessment"},
  ];
  isNavigated:boolean = false;
  sliceDigits:number = 6;
  CategoriesOptions: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    autoplay: false,
    autoWidth: true,
    margin: 20,
    dots: false,
    navSpeed: 700,
    navText: ['<em class="icon-LeftArrow prev"></em>', '<em class="icon-RightArrow next"></em>'],
    nav: true,
    startPosition: 0,
    responsive: {
      0: {
        items: 2
      },
      520: {
        items: 3
      },
      690: {
        items: 4
      },
      920: {
        items: 5
      },
      1100: {
        items: 6
      }
    },
  };
  activeSlides: SlidesOutputData;
  slidesStore: any[];
  allArealength:number = 0;
  catlogData: any = [];
  searchKey;
  userDetails;
  enroledCourse:any = [];
  secretKey = "(!@#Passcode!@#)";
  selectedCarousel: number = 0;
  constructor(private _loading: LoadingService,
              private router: Router,
              private catalogService: CatalogService,
              private route: ActivatedRoute,
              private appConfig: AppConfigService,
              public breakpointObserver: BreakpointObserver,
              public toast: ToastrService,
              private util: UtilityService,
              private ga_service: GoogleAnalyticsService,
              private commonService:CommonService
  ) { }

  ngOnInit() {
    this.userDetails = JSON.parse(this.appConfig.getLocalStorage('userDetails'));
    this.setSliceValue();
    this.ga_service.gaSetPage("View all courses")
    if (this.route.snapshot.queryParams.selectedTab) {
      this.fromTab = window.localStorage.getItem('selectedID') ? window.localStorage.getItem('selectedID') : 'All';
      this.isNavigated = true;
    }
    this.getDomain(this.productType);
    // this.subscriberdata = this.router.events.pipe(
    //   filter((event: RouterEvent) => event instanceof NavigationEnd),
    //   takeUntil(this.destroyed)
    // ).subscribe(() => {
    //   this.fromTab = atob(this.route.snapshot.queryParams.selectedTab);
    //   this.getDomain(this.productType);
    // })

  }
  getenrolledCourse(){
    this.catalogService.getEnrolledCourse({email:this.userDetails?.email}).subscribe((result:any)=>{
      if(result?.success && result?.data?.enrolledcourseIds.length > 0){
        this.enroledCourse = result?.data?.enrolledcourseIds;
         this.util.isEnrolled.next(true);
      }
      this.getDomain(this.productType);
    });
  }
  ngOnDestroy(){
    // this.subscriberdata.unsubscribe();
  }
  moveLeft() {
    this.ds.moveLeft();
  }
  moveRight() {
    this.ds.moveRight();
  }
  leftBoundStat(reachesLeftBound: boolean) {
    this.leftNavDisabled = reachesLeftBound;
  }

  rightBoundStat(reachesRightBound: boolean) {
    this.rightNavDisabled = reachesRightBound;
  }
  setSliceValue(){
    this.breakpointObserver
      .observe(['(max-width: 500px)'])
      .subscribe((state: BreakpointState) => {
        if(this.viewMore){
          if (state.matches) {
            this.sliceDigits = 3;
          } else {
            this.sliceDigits = 6;
          }
        }

      });
  }
  getDomain(type) {
    const apiParms = {
      productType:this.productType,
      courseOrigin:environment.userOrigin
  }
    this.catalogService.getCatalog(apiParms).subscribe((response: any) => {
      if (response.data.length > 0) {
        this.tabValues = response.data;
        this.tabValues.sort((a,b) => a.sequenceOrder > b.sequenceOrder ? 1 :-1);
        this.allArealength = 0;
        this.tabValues.forEach((element:any) => {
          this.allArealength = this.allArealength + (element?.children ? element.children.length : 0)
        });
        this.tabValues.splice(0, 0, this.firstTabValue);
        this.tabValues.filter((ele, i)=> {
          if(ele.cid == this.fromTab) {
            this.selectedCarousel = i;
          }
        })
        this.CategoriesOptions.startPosition = this.selectedCarousel;
        this.getArea(this.fromTab);
      } else {
        this.tabValues = []
      }
    })
  }

  getArea(id) {
    this.noDataSkeleton = true;
    this.noDataFound = false;
    this.searchKey = "";
    this.selectedTab = id;
    window.localStorage.setItem('selectedID',id)
    this.tabValues.forEach(element => {
      element.isSelected = false;
      if (element.cid == id) {
        element.isSelected = true;
      }
    });
    var params = {
      "domainId": id,
      "pagenumber": this.pageNumber,
      "productType" :'course',
      "courseOrigin":environment.userOrigin
    }
    this.catalogService.getAreaByDomain(params).subscribe((response: any) => {
      this.noDataSkeleton = false;
      if (response.data?.length > 0) {
        this.areaCards = response.data;
        this.areaCards.sort((a, b) => a.sequenceOrder > b.sequenceOrder ? 1 : -1);
        if(!this.isNavigated){
          this.areaCards = this.areaCards.filter(e => e?.isFeatured)
        }
        this.noDataFound = false;
        this.viewMore = (!this.isNavigated && this.areaCards?.length > 6) ? true : false;
        this.sliceDigits =  !this.viewMore ? this.areaCards?.length + 1 : 6;
        this.catlogData = this.areaCards;
      } else {
        this.viewMore = false;
        this.areaCards = [];
        this.catlogData = [];
        this.noDataFound = true;
      }
    })
    this._loading.setLoading(false, environment.API_BASE_URL+"getAreaByDomain");
  }
  catalogHome() {
    this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.home, { fromPage: btoa("viewAll"), selectedTab: btoa(this.selectedTab) });
    localStorage.setItem("selectedID",'All');
  }

  aboutAssessment(value) {
    if(value.cid == "GTC1018"){
      this.toast.warning('Comming Soon');
      return false;
    }
      this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.aboutCourse, { id: btoa(value?.cid), selectedTab: btoa('All') ,productType : btoa('course'),parentId:btoa(value?.parentId)});
  }
  filterTab(e){
    this.fromTab='All';
    this.getDomain(this.filteredTab);
  }

  getPassedData(data: SlidesOutputData) {
    this.activeSlides = data;
    console.log(this.activeSlides);
  }

  catalogSearch(){
    this.catlogData = this.areaCards.filter((e: any) => {
      return e.name.toLowerCase().includes(this.searchKey.toLowerCase());
    });
    this.noDataFound = this.catlogData.length == 0 ? true : false;
  }
  enroll(e) {
    if (this.userDetails) {
      const apiParam =
        {
          "enrolledCourse": e?.enrolledCourse,
          "is_free": e?.is_free,
          "username": this.userDetails?.email,
          "course_id": CryptoJS.AES.encrypt(e?.cid, this.secretKey.trim()).toString(),
          "courseName":CryptoJS.AES.encrypt(e?.name, this.secretKey.trim()).toString(),
          "firstName": CryptoJS.AES.encrypt(this.userDetails?.firstname, this.secretKey.trim()).toString(),
          "userId":this.userDetails?.userId
      }
      this.catalogService.userSyncUpLxp(apiParam).subscribe((result:any)=>{
        if(result?.success){
          this.toast.success("You have been enrolled to the course successfully!");
          this.catalogService.getEnrolledCourse({email:this.userDetails?.email}).subscribe((result:any)=>{
            if(result?.success && result?.data?.enrolledcourseIds.length > 0){
              this.enroledCourse = result?.data?.enrolledcourseIds;
               this.util.isEnrolled.next(true);
               this.setEnrolledFlag();
            }
          });
        }
        else {
          this.toast.warning(result?.message ? result?.message : "Something Went Wrong!!")
        }
      });
    }
    else {
      this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, {fromPage: this.commonService.encrypt('0',this.secretKey)});
    }
  }
  setEnrolledFlag(){
    this.areaCards.forEach((element:any)=>{
      var enrolFlag = this.enroledCourse.filter(e => e == element.cid);
      if(enrolFlag.length > 0){
        element.isEnrolled = true;
      }
      else {
        element.isEnrolled = false;
      }
    });
  this.catlogData = this.areaCards;
  }
}
