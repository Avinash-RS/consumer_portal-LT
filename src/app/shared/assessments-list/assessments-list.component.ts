import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from "@angular/router"
import { ActivatedRoute } from '@angular/router';
import { AppConfigService } from 'src/app/utils/app-config.service';
import { APP_CONSTANTS } from 'src/app/utils/app-constants.service';
import { CatalogService } from "../../services/catalog.service"
import { environment } from '@env/environment';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { SlideIn } from '../../animations'
@Component({
  selector: 'app-assessments-list',
  templateUrl: './assessments-list.component.html',
  styleUrls: ['./assessments-list.component.scss'],
  animations: SlideIn
})
export class AssessmentsListComponent implements OnInit {
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
  productType:string = 'assessment';
  constructor(private _loading: LoadingService,
              private router: Router,
              private catalogService: CatalogService,
              private route: ActivatedRoute,
              private appConfig: AppConfigService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.queryParams.selectedTab) {
      this.fromTab = this.route.snapshot.queryParams.selectedTab;
      this.productType = this.route.snapshot.queryParams.productType ? this.route.snapshot.queryParams.productType : 'assessment';
      this.viewMore = false
    }
    this.getDomain(this.productType);
    this.subscriberdata = this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd),
      takeUntil(this.destroyed)
    ).subscribe(() => {
      this.fromTab = this.route.snapshot.queryParams.selectedTab;
      this.viewMore = false
      this.getDomain(this.productType);
    })

  }
  ngOnDestroy(){
    this.subscriberdata.unsubscribe();
  }

  getDomain(type) {
    this.productType = type;
    this.catalogService.getCatalog(type).subscribe((response: any) => {
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
      "productType" :this.productType
    }
    this.catalogService.getAreaByDomain(params).subscribe((response: any) => {
      this.noDataSkeleton = false;
      if (response.data?.length > 0) {
        this.areaCards = response.data;
        this.noDataFound = false;
        if (this.areaCards?.length < 7) {
          this.viewMore = false;
        }
        else {
          this.viewMore = true;
        }
      } else {
        this.viewMore = false;
        this.areaCards = [];
        this.noDataFound = true;
      }
    })
    this._loading.setLoading(false, environment.API_BASE_URL+"getAreaByDomain");
  }
  catalogHome() {
    this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.home, { fromPage: "viewAll", selectedTab: this.selectedTab });
  }

  aboutAssessment(cid) {
    this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.aboutAssessment, { id: cid, selectedTab: this.selectedTab ,productType : this.productType});
  }
}
