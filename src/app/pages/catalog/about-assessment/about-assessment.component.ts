import { Component, OnInit, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from "@angular/router"
import {ActivatedRoute} from '@angular/router';
import { AppConfigService } from 'src/app/utils/app-config.service';
import { APP_CONSTANTS } from 'src/app/utils/app-constants.service';
import { CatalogService } from "../../../services/catalog.service";
import { environment } from '@env/environment';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-about-assessment',
  templateUrl: './about-assessment.component.html',
  styleUrls: ['./about-assessment.component.scss']
})
export class AboutAssessmentComponent implements OnInit {
  howItWorks:any
  isReadMore = true
  areaId;
  pageNumber = 0;
  aboutArea;
  domainId;
  isSticky: boolean = false;
  blobToken: string = environment.blobKey;
  bannerImage;
  showAssesment = false;
  competencyList;
  competencyData;
  totalAssessmentCount: any;
  productType:string =  "assessment"
  constructor(private router: Router, private catalogService : CatalogService,private route:ActivatedRoute,private appconfig: AppConfigService,private commonService : CommonService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
   }
  public destroyed = new Subject<any>();
  ngOnInit(): void {
    this.getDetails()
    this.route.queryParams
    .subscribe(params => {
      console.log(params);
      this.domainId = params.selectedTab;
      this.areaId = params.id;
      this.productType = params.productType
      this.getArea();
      this.checkScroll();
    })

    //on reload or param change
    // this.router.events.pipe(
    //   filter((event: RouterEvent) => event instanceof NavigationEnd),
    //   takeUntil(this.destroyed)
    // ).subscribe(() => {
    //   console.log('3');
    //   this.domainId = this.route.snapshot.queryParams.selectedTab;
    //   this.areaId = this.route.snapshot.queryParams.id;
    //   this.getArea();
    //   this.checkScroll();
    //   this.showAssesment = false;
    // },
    // err =>{
    //   console.log('4');
    //   this.domainId = this.route.snapshot.queryParams.selectedTab;
    //   this.areaId = this.route.snapshot.queryParams.id;
    //   this.getArea();
    //   this.checkScroll();
    //   this.showAssesment = false;
    // });
  }



  getDetails() {
    this.commonService.getCertificationDetails().subscribe((response :any)=>{
      if(response.success) {
        this.howItWorks = response.data
      }
    })
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
  //Scroll
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 370;
  }
  showText() {
    this.isReadMore = !this.isReadMore
  }

  getArea(){
    var params = {
      "domainId" : this.domainId,
      "pagenumber" : this.pageNumber,
      "productType" : this.productType
  }
    this.catalogService.getAreaByDomain(params).subscribe((response : any)=>{
      if (response.data?.length > 0) {
      var areaDetails = response.data
        areaDetails.forEach(element => {
          if (element.cid == this.areaId) {
            this.aboutArea = element;
            if (this.aboutArea?.contentDescription?.length < 370) {
              this.isReadMore = false;
            } else {
              this.isReadMore = true;
            }
          }
        });
        if (this.aboutArea) {
          this.bannerImage = this.aboutArea.image.url;
        }
        this.getCompetency();
      }
    })
  }

  getCompetency(){
    var params = {
      "areaId" :  this.areaId,
      "pagenumber" : 0
    }
    this.catalogService.getCompetency(params).subscribe((response:any)=>{
      if (response.data?.length > 0) {
        this.competencyList = response.data
        this.totalAssessmentCount = 0;
        for(let details of response.data){
          this.totalAssessmentCount += details.totalAssessment
        }
      }
    })
  }

  openAssessments(competency){
    this.aboutArea['contentAchieve'] = competency.contentAchieve
    this.aboutArea['contentRequirement'] = competency.contentRequirement
    this.aboutArea['contentDescription'] = competency.contentDescription
    this.showAssesment = true;
    this.competencyData = competency
  }
}
