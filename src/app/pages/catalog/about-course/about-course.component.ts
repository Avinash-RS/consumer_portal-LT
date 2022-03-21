import { Component, OnInit, HostListener, ViewChild, TemplateRef, ElementRef, AfterViewChecked } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from "@angular/router"
import {ActivatedRoute} from '@angular/router';
import { AppConfigService } from 'src/app/utils/app-config.service';
import { APP_CONSTANTS } from 'src/app/utils/app-constants.service';
import { CatalogService } from "../../../services/catalog.service";
import { environment } from '@env/environment';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { UtilityService } from 'src/app/services/utility.service';
import { MatDialog } from '@angular/material/dialog';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalValidatorsService } from 'src/app/validators/global-validators.service';

@Component({
  selector: 'app-about-course',
  templateUrl: './about-course.component.html',
  styleUrls: ['./about-course.component.scss']
})
export class AboutCourseComponent implements OnInit {
  selectedIndex = 0;
  TopicsOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    margin: 30,
    navText: ["<i class='icon-LeftArrow'></i>", "<i class='icon-RightArrow'></i>"],
    nav: true,
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
    dots: false,
    navSpeed: 700,
    margin: 30,
    navText: ["<i class='icon-LeftArrow'></i>", "<i class='icon-RightArrow'></i>"],
    nav: true,
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
      700: {
        items: 3,
        slideBy: 3
      },
      1024: {
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
  @ViewChild('enroll', { static: false }) enrollRequest: TemplateRef<any>;
  backgroundImageUrl: any;
  contactForm: FormGroup;
  queryForm: FormGroup;
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

  constructor(private router: Router, private catalogService : CatalogService,private route:ActivatedRoute,private appconfig: AppConfigService,
    private commonService : CommonService,public toast: ToastrService ,private util: UtilityService,private dialog: MatDialog,
    private fb: FormBuilder, 
    private gv: GlobalValidatorsService) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => {
        return false;
      };
     }

  ngOnInit(): void {
    this.userDetails = JSON.parse(this.appconfig.getSessionStorage('userDetails'));
    this.route.queryParams
    .subscribe(params => {
      this.domainId = atob(params.selectedTab);
      this.areaId = atob(params.id);
      this.productType = atob(params.productType);
      this.getAbouCourse();
    });
    this.contactFormInitilize();
    this.queryFormInitilize();
  }
  contactFormInitilize(){
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, this.gv.email()]],
      phone: ['', [Validators.required]],
      comment:[''],

    });
  }
  queryFormInitilize(){
    this.queryForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, this.gv.email()]],
      phone: ['', [Validators.required]],
      subject:['', [Validators.required]],
      message:['']
      
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
  get queryname() {
    return this.queryForm.get('name');
  }
  get queryemail() {
    return this.queryForm.get('email');
  }
  get queryphone() {
    return this.queryForm.get('phone');
  }
  get querysubject() {
    return this.queryForm.get('subject');
  }


setOffset(){
  this.firstOffset =  this.firstElement?.nativeElement?.offsetTop? this.firstElement.nativeElement.offsetTop -210 : 491;
  this.secondOffset = this.secondElement?.nativeElement?.offsetTop? this.secondElement.nativeElement.offsetTop - 210 :956;
  this.thirdOffset =  this.thirdElement?.nativeElement?.offsetTop? this.thirdElement.nativeElement.offsetTop -210:3110;
  this.fourthOffset = this.fourthElement?.nativeElement?.offsetTop? this.fourthElement.nativeElement.offsetTop -210:5945;
  this.fifthOffset =  this.fifthElement?.nativeElement?.offsetTop? this.fifthElement.nativeElement.offsetTop -210:6672;
  this.sixthOffset =  this.sixthElement?.nativeElement?.offsetTop? this.sixthElement.nativeElement.offsetTop -210:7404;
  this.seventhOffset = this.seventhElement ?.nativeElement?.offsetTop? this.seventhElement.nativeElement.offsetTop -210:8255;
  this.eigthOffset =  this.eigthElement?.nativeElement?.offsetTop? this.eigthElement.nativeElement.offsetTop -210 :8822;
}
  checkOffsetTop() {
    
    const windowOffSet = window.pageYOffset;
    if(windowOffSet >= this.firstOffset && windowOffSet < this.secondOffset && windowOffSet < this.thirdOffset && windowOffSet < this.fourthOffset && windowOffSet < this.fifthOffset && windowOffSet < this.sixthOffset  && windowOffSet < this.seventhOffset && windowOffSet < this.eigthOffset){
      this.activeSection = 1;
    }
    else if(windowOffSet >= this.firstOffset && windowOffSet >= this.secondOffset && windowOffSet < this.thirdOffset && windowOffSet < this.fourthOffset && windowOffSet < this.fifthOffset && windowOffSet < this.sixthOffset  && windowOffSet < this.seventhOffset && windowOffSet < this.eigthOffset){
      this.activeSection = 2;
    }
    else if(windowOffSet >= this.firstOffset && windowOffSet >= this.secondOffset && windowOffSet >= this.thirdOffset && windowOffSet < this.fourthOffset && windowOffSet < this.fifthOffset && windowOffSet < this.sixthOffset  && windowOffSet < this.seventhOffset && windowOffSet < this.eigthOffset){
      this.activeSection = 3;
    }
    else if(windowOffSet >= this.firstOffset && windowOffSet >= this.secondOffset && windowOffSet >= this.thirdOffset && windowOffSet >= this.fourthOffset && windowOffSet < this.fifthOffset && windowOffSet < this.sixthOffset  && windowOffSet < this.seventhOffset && windowOffSet < this.eigthOffset){
      this.activeSection = 4;
    }
    else if(windowOffSet >= this.firstOffset && windowOffSet >= this.secondOffset && windowOffSet >= this.thirdOffset && windowOffSet >= this.fourthOffset && windowOffSet >= this.fifthOffset && windowOffSet < this.sixthOffset  && windowOffSet < this.seventhOffset && windowOffSet < this.eigthOffset){
      this.activeSection = 5;
    }
    else if(windowOffSet >= this.firstOffset && windowOffSet >= this.secondOffset && windowOffSet >= this.thirdOffset && windowOffSet >= this.fourthOffset && windowOffSet >= this.fifthOffset && windowOffSet >= this.sixthOffset  && windowOffSet < this.seventhOffset && windowOffSet < this.eigthOffset){
      this.activeSection = 6;
    }
    else if(windowOffSet >= this.firstOffset && windowOffSet >= this.secondOffset && windowOffSet >= this.thirdOffset && windowOffSet >= this.fourthOffset && windowOffSet >= this.fifthOffset && windowOffSet >= this.sixthOffset  && windowOffSet >= this.seventhOffset && windowOffSet < this.eigthOffset){
      this.activeSection = 7;
    }  else if(windowOffSet >= this.firstOffset && windowOffSet >= this.secondOffset && windowOffSet >= this.thirdOffset && windowOffSet >= this.fourthOffset && windowOffSet >= this.fifthOffset && windowOffSet >= this.sixthOffset  && windowOffSet >= this.seventhOffset && windowOffSet >= this.eigthOffset){
      this.activeSection = 8;
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
          setTimeout(() => {
            this.setOffset();
          }, 1000);
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
  navigateBatch() {
    this.appconfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.batchPurchase, {id: btoa(this.areaId), selectedTab: btoa(this.domainId) ,productType : btoa(this.productType)});
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
        //Add to Cart
        this.catalogService.addToCart(cartParams).subscribe((response:any) =>{
          if(response.success) {
            //is Free check
            if(this.abouCourseData?.is_free){
              this.freeOrderPlace(response?.data[0].cartId);
            }
            else{
              this.toast.success("Added to cart");
              this.util.cartSubject.next(true);
            }
          }
          else {
            this.toast.warning(response.message);
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
        });
        let orderParms  = {
          user_id:this.userDetails.userId,
          cartId:cartid,
          cart:freeCart
        };
        this.catalogService.createOrder(orderParms).subscribe((data: any) => {
          if(data?.success){
            this.toast.success("Course order created");
            this.appconfig.routeNavigationWithQueryParam("cart/success",{ orderId: btoa(data.orderId) });
          }
          else{
            this.toast.warning(data?.message ? data?.message :'Some thing went wrong')
          }
        });
      }
      scroll(ID) {
        // document.getElementById(ID).scrollIntoView({behavior: "smooth"});
        this.activeSection = ID;
        var yOffset;
        if(this.sticky){
          yOffset = -140;
        }
        else{
          yOffset = -170;
        }
        const element = document.getElementById(ID);
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
    
    }
    openRequest(){
      const query = this.dialog.open(this.enrollRequest, {
        width: '60%',
        height: '75%',
        autoFocus: true,
        closeOnNavigation: true,
        disableClose: true,
        panelClass: 'queryFormContainer'
      });
      query.afterClosed().subscribe(result => {
        //this.contactForm.reset();
      });
      return false;
    }
    requestQuery(formType){
      var apidata;
      if(formType == 'academicCouncillor'){
       apidata = {
          formType:formType,
          name: this.contactForm.value.name,
          email:this.contactForm.value.email,
          phone:this.contactForm.value.phone,
          comment:this.contactForm.value.comment
        }
      }
      else if(formType == 'careerCouncillor' || formType == 'assistToEnroll'){
        apidata = {
           formType:formType,
           name: this.queryForm.value.name,
           email:this.queryForm.value.email,
           phone:this.queryForm.value.phone,
           subject:this.queryForm.value.subject,
           message:this.queryForm.value.message
         }
       }
      this.catalogService.registerQuery(apidata).subscribe((result:any)=>{
        if(result?.success){
          this.toast.success(result?.message);
          this.contactForm.reset();
          this.queryForm.reset();
          this.dialog.closeAll();
        }
        else{
          this.toast.success(result?.message);
          this.contactForm.reset();
          this.queryForm.reset();
          this.dialog.closeAll();
        }
      });
    }
}
