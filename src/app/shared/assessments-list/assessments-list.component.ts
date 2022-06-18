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
  subscriberdata: any;
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
    margin: 20,
    dots: false,
    navSpeed: 700,
    navText: ['<em class="icon-LeftArrow prev"></em>', '<em class="icon-RightArrow next"></em>'],
    responsive: {
      0: {
        items: 2
      },
      480: {
        items: 4
      },
      768: {
        items: 6
      }
    },
    nav: true
  };
  activeSlides: SlidesOutputData;
  slidesStore: any[];
  constructor(private _loading: LoadingService,
              private router: Router,
              private catalogService: CatalogService,
              private route: ActivatedRoute,
              private appConfig: AppConfigService,
              public breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    this.setSliceValue();
    if (this.route.snapshot.queryParams.selectedTab) {
      this.fromTab = atob(this.route.snapshot.queryParams.selectedTab);
      // this.productType = this.route.snapshot.queryParams.productType ? atob(this.route.snapshot.queryParams.productType) : 'all';
      this.isNavigated = true;
    }
    this.getDomain(this.productType);
    this.subscriberdata = this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd),
      takeUntil(this.destroyed)
    ).subscribe(() => {
      this.fromTab = atob(this.route.snapshot.queryParams.selectedTab);
      this.getDomain(this.productType);
    })

  }
  ngOnDestroy(){
    this.subscriberdata.unsubscribe();
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
        this.tabValues.splice(0, 0, this.firstTabValue)
        this.getArea(this.fromTab);
      } else {
        this.tabValues = []
      }
    })
  }

  getArea(id) {
    this.noDataSkeleton = true;
    this.noDataFound = false;
    this.selectedTab = id
    this.tabValues.forEach(element => {
      element.isSelected = false;
      if (element.cid == id) {
        element.isSelected = true;
      }
    });

    var params = {
      "domainId": id,
      "pagenumber": this.pageNumber,
      "productType" :this.productType,
      "courseOrigin":environment.userOrigin
    }
    this.catalogService.getAreaByDomain(params).subscribe((response: any) => {
      this.noDataSkeleton = false;
      if (response.data?.length > 0) {
        this.areaCards = response.data;
        this.areaCards.sort((a, b) => a.sequenceOrder > b.sequenceOrder ? 1 : -1);
        this.noDataFound = false;
        this.viewMore = (!this.isNavigated && this.areaCards?.length > 6) ? true : false;
        this.sliceDigits =  !this.viewMore ? this.areaCards?.length + 1 : 6;
      } else {
        this.viewMore = false;
        this.areaCards = [];
        this.noDataFound = true;
      }
    })
    this._loading.setLoading(false, environment.API_BASE_URL+"getAreaByDomain");
  }
  catalogHome() {
    this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.home, { fromPage: btoa("viewAll"), selectedTab: btoa(this.selectedTab) });
  }

  aboutAssessment(cid,productType) {
    if(productType == 'course'){
      this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.aboutCourse, { id: btoa(cid), selectedTab: btoa(this.selectedTab) ,productType : btoa(productType)});
    }
    else{
      this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.aboutAssessment, { id: btoa(cid), selectedTab: btoa(this.selectedTab) ,productType : btoa(productType)});
    }
   
  }
  filterTab(e){
    this.fromTab='All';
    this.getDomain(this.filteredTab);
  }

  getPassedData(data: SlidesOutputData) {
    this.activeSlides = data;
    console.log(this.activeSlides);
  }

}
