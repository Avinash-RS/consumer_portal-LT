import { Component, OnInit, HostListener, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from "@angular/router"
import {ActivatedRoute} from '@angular/router';
import { AppConfigService } from 'src/app/utils/app-config.service';
import { APP_CONSTANTS } from 'src/app/utils/app-constants.service';
import { CatalogService } from "../../../services/catalog.service";
import { environment } from '@env/environment';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { UtilityService } from 'src/app/services/utility.service';
import { MatDialog } from '@angular/material/dialog';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalValidatorsService } from 'src/app/validators/global-validators.service';
@Component({
  selector: 'app-about-assessment',
  templateUrl: './about-assessment.component.html',
  styleUrls: ['./about-assessment.component.scss']
})
export class AboutAssessmentComponent implements OnInit {
  selectedIndex = 0;
  TopicsOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    margin: 30,
    navText: ["<i class='icon-LeftArrow'></i>", "<i class='icon-RightArrow'></i>"],
    nav: false,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      992: {
        items: 2
      }
    }
  }
  expertOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    margin: 30,
    navText: ["<i class='icon-LeftArrow'></i>", "<i class='icon-RightArrow'></i>"],
    nav: false,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      992: {
        items: 3
      }
    }
  }
  //
  relatedList: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    margin: 30,
    navText: ["<i class='icon-Back'></i>", "<i class='icon-right-next'></i>"],
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      992: {
        items: 4,
        slideBy: 4
      }
    }
  }

  howItWorks:any
  isReadMore = true
  areaId;
  pageNumber = 0;
  aboutArea;
  domainId;
  // isSticky: boolean = false;
  blobToken: string = environment.blobKey;
  bannerImage;
  showAssesment = false;
  competencyList;
  competencyData;
  totalAssessmentCount: any;
  productType:string =  "assessment";
  abouCourseData:any;
  courseData:any;
  userDetails;
  nocard:boolean = true;
  defaultDiv:boolean = true;
  @ViewChild('kycmandate', { static: false }) matDialogRef: TemplateRef<any>;
  backgroundImageUrl: any;
  constructor(private router: Router, private catalogService : CatalogService,private route:ActivatedRoute,private appconfig: AppConfigService,
    private commonService : CommonService,public toast: ToastrService ,private util: UtilityService,private dialog: MatDialog,private fb: FormBuilder,
    private gv: GlobalValidatorsService
    ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
   }
  public destroyed = new Subject<any>();
  contactForm: FormGroup;
  @ViewChild('stickyMenu') menuElement: ElementRef;
  sticky: boolean = false;
  menuPosition: any = 472;
  activeSection:any;
  @ViewChild('1') firstElement: ElementRef;
  @ViewChild('2') secondElement: ElementRef;
  @ViewChild('3') thirdElement: ElementRef;
  @ViewChild('4') fourthElement: ElementRef;
  @ViewChild('5') fifthElement: ElementRef;
  @ViewChild('6') sixthElement: ElementRef;
  @ViewChild('7') seventhElement: ElementRef;
  @ViewChild('8') eigthElement: ElementRef;
  firstOffset: Number = null;
  secondOffset: Number = null;
  thirdOffset: Number = null;
  fourthOffset: Number = null;
  fifthOffset: Number = null;
  sixthOffset: Number = null;
  seventhOffset: Number = null;
  eigthOffset: Number = null;

  @HostListener('window:scroll', ['$event'])
    handleScroll(){
        const windowScroll = window.pageYOffset;
        if(windowScroll >= this.menuPosition){
            this.sticky = true;
        } else {
            this.sticky = false;
        }
       this.checkOffsetTop();
        setTimeout(()=>{
            if(window.pageYOffset < this.menuPosition){
              this.activeSection = null;
            }
              },500);
    }
    checkOffsetTop() {
      const windowOffSet = window.pageYOffset;
      if(windowOffSet >= this.firstOffset && windowOffSet < this.secondOffset ){
        this.activeSection = 1;
      }
      else if(windowOffSet >= this.firstOffset && windowOffSet >= this.secondOffset && windowOffSet < this.thirdOffset && windowOffSet < this.fourthOffset && windowOffSet < this.fifthOffset && windowOffSet < this.sixthOffset  && windowOffSet < this.seventhOffset){
        this.activeSection = 2;
      }
      else if(windowOffSet >= this.firstOffset && windowOffSet >= this.secondOffset && windowOffSet >= this.thirdOffset && windowOffSet < this.fourthOffset && windowOffSet < this.fifthOffset && windowOffSet < this.sixthOffset  && windowOffSet < this.seventhOffset){
        this.activeSection = 3;
      }
      else if(windowOffSet >= this.firstOffset && windowOffSet >= this.secondOffset && windowOffSet >= this.thirdOffset && windowOffSet >= this.fourthOffset && windowOffSet < this.fifthOffset && windowOffSet < this.sixthOffset  && windowOffSet < this.seventhOffset){
        this.activeSection = 4;
      }
      else if(windowOffSet >= this.firstOffset && windowOffSet >= this.secondOffset && windowOffSet >= this.thirdOffset && windowOffSet >= this.fourthOffset && windowOffSet >= this.fifthOffset && windowOffSet < this.sixthOffset  && windowOffSet < this.seventhOffset){
        this.activeSection = 5;
      }
      else if(windowOffSet >= this.firstOffset && windowOffSet >= this.secondOffset && windowOffSet >= this.thirdOffset && windowOffSet >= this.fourthOffset && windowOffSet >= this.fifthOffset && windowOffSet >= this.sixthOffset  && windowOffSet < this.seventhOffset){
        this.activeSection = 6;
      }
      else if(windowOffSet >= this.firstOffset && windowOffSet >= this.secondOffset && windowOffSet >= this.thirdOffset && windowOffSet >= this.fourthOffset && windowOffSet >= this.fifthOffset && windowOffSet >= this.sixthOffset  && windowOffSet >= this.seventhOffset && windowOffSet < this.eigthOffset){
        this.activeSection = 7;
      }
      else if(windowOffSet >= this.firstOffset && windowOffSet >= this.secondOffset && windowOffSet >= this.thirdOffset && windowOffSet >= this.fourthOffset && windowOffSet >= this.fifthOffset && windowOffSet >= this.sixthOffset  && windowOffSet >= this.seventhOffset && windowOffSet >= this.eigthOffset){
        this.activeSection = 8;
      }

    }
      ngAfterViewInit(){
        setTimeout(()=>{
           this.firstOffset =  this.firstElement.nativeElement.offsetTop - 200;
           this.secondOffset =  this.secondElement.nativeElement.offsetTop - 200;
           this.thirdOffset =  this.thirdElement.nativeElement.offsetTop - 200;
           this.fourthOffset =  this.fourthElement.nativeElement.offsetTop - 200;
           this.fifthOffset =  this.fifthElement.nativeElement.offsetTop - 200;
           this.sixthOffset =  this.sixthElement.nativeElement.offsetTop - 200;
           this.seventhOffset =  this.seventhElement.nativeElement.offsetTop -200;
           this.eigthOffset =  this.eigthElement.nativeElement.offsetTop -200;
        },1000)
    }
  ngOnInit(): void {
    this.userDetails = JSON.parse(this.appconfig.getSessionStorage('userDetails'));
    this.route.queryParams
    .subscribe(params => {
      this.domainId = atob(params.selectedTab);
      this.areaId = atob(params.id);
      this.productType = atob(params.productType);
      if(this.productType  == 'course'){
        this.getAbouCourse();
      }
      else{
        this.getDetails();
        this.getArea();
        //this.checkScroll();
      }
      this.scrollTop();
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
    this.contactFormInitilize();
  }
  contactFormInitilize(){
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, this.gv.email()]],
      phone: ['', [Validators.required]],
      comment:['']
    });
  }
  get name() {
    return this.contactForm.get('name');
  }
  get email() {
    return this.contactForm.get('email');
  }
  get phone() {
    return this.contactForm.get('phone');
  }  
  scrollTop(){
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }
getAbouCourse(){
  var params = {
    "competencyId":this.areaId,
    "productType":"course"
}
  this.catalogService.getAssesments(params).subscribe((response:any)=>{
    if (response.success) { 
      if(response.data && response.data.length > 0 && response.data[0].assessmentData && response.data[0].assessmentData.length){
        this.abouCourseData = response.data[0];
        this.courseData = this.abouCourseData.assessmentData[0];
        this.defaultDiv = false;
        this.nocard = false;
      }
      else{
        this.abouCourseData = [];
        this.defaultDiv = false;
        this.nocard = true;
      }
    }
    else{
      this.abouCourseData = [];
      this.defaultDiv = false;
      this.nocard = true;
    }
  })
  this.backgroundImageUrl = this.courseData?.image?.url;
}

dialogSetup(){
  const valdat = this.dialog.open(this.matDialogRef, {
    width: '400px',
    height: '300px',
    autoFocus: true,
    closeOnNavigation: true,
    disableClose: true,
    panelClass: 'popupModalContainerForForms'
  });
  return false;
}
courseBuy(){
//signin check 
if (this.userDetails) {
  const data = {
    "noofFields": "44",
    "email": this.userDetails.email ? this.userDetails.email : null
  }
  var cartParams = {
      "isLevel":false,
      "levelId":this.abouCourseData?.levelId,
      "userId":this.userDetails.userId,
      "assessmentId":this.areaId,
      "competencyId":this.areaId,
      "productType" :this.productType
  }
   //profile percentage check 
  this.commonService.getProfilePercentage(data).subscribe((result: any) => {
    if (result?.success) {
      //let profilePercentage = result.data[0].profilePercentage;
      let KYCFlag = result.data[0].KYCMandFlag ? result.data[0].KYCMandFlag : 0;
          if (KYCFlag == 0) {
            this.dialogSetup();
          }
          else{
            //Add to Cart
            this.catalogService.addToCart(cartParams).subscribe((response:any) =>{
              if(response.success) {
                //is Free check
                if(this.abouCourseData?.is_free){
                  this.freeOrderPlace(response?.data[0].cartId);
                }
                else{
                  this.toast.success("Course added to cart");
                  this.util.cartSubject.next(true);
                }
              }
              else {
                this.toast.warning(response.message);
              }
            });
          }
    }
    else{
      this.toast.warning(result.message);
      return false;
    }
  });
}
else{
  cartParams = {
      "isLevel":false,
      "levelId":this.abouCourseData?.levelId,
      "userId":'',
      "assessmentId":this.areaId,
      "competencyId":this.areaId,
      "productType" :this.productType
  }
  this.util.setValue(cartParams);
  this.appconfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, {fromPage: '0'});
}
  }
freeOrderPlace(cartid){
  let freeCart = [];
  freeCart.push({
    assessmentId: this.areaId,
    quantity: 1,
    amount_per_assessment: 0,
    total_amount: 0,
    competencyId: this.areaId,
    levelId: this.abouCourseData?.levelId,
    productType : this.productType
  });
  var orderParms ={
    user_id:this.userDetails.userId,
    order_amount:0,
    cart :freeCart,
    cartId:cartid,
  }
  this.catalogService.createOrder(orderParms).subscribe((data: any) => {
    // this.toast.success("Course order created");
    this.appconfig.routeNavigationWithQueryParam("cart/success",{ orderId: btoa(data.order_id) });
  });
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
  // @HostListener('window:scroll', ['$event'])
  // checkScroll() {
  //   this.isSticky = window.pageYOffset >= 370;
  // }
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
  scroll(ID) {
    // document.getElementById(ID).scrollIntoView({behavior: "smooth"});
    this.activeSection = ID;
    var yOffset;
    if(this.sticky){
      yOffset = -72;
    }
    else{
      yOffset = -120;
    }
    const element = document.getElementById(ID);
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({top: y, behavior: 'smooth'});

}
}
