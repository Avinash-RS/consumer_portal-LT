import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from 'src/app/services/utility.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { ActivatedRoute } from '@angular/router';
import { AppConfigService } from 'src/app/utils/app-config.service';
import { APP_CONSTANTS } from 'src/app/utils/app-constants.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { BookSlotComponent } from '../../bookSlot/bookSlot.component';
import { environment } from '@env/environment';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  owlCarouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    margin: 30,
    navSpeed: 700,
    navText: ['<i class=\'icon-LeftArrow\'></i>', '<i class=\'icon-RightArrow\'></i>'],
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      300: {
        items: 1
      },
      600: {
        margin: 40,
        items: 2
      }
    }
  };
  orderlist: any = [];
  // slot variables
  minDate = new Date();
  slotDate: any = this.minDate;
  testData: any;
  currentCid: any;
  assesmentName: any;
  userDetails: any;
  levelName: any;
  competencyName: any;
  orderId: any;
  lxpCheck:boolean = false;
  stepCheck:boolean = false;
  stepCourseId  = [];
  course_details = [];
  // activate: boolean = false;
  // activeDate: string;
  // activeTime: any;
  constructor(
    private appConfig: AppConfigService,
    private dialog: MatDialog,
    public route: ActivatedRoute,
    private util: UtilityService,
    private catalog: CatalogService,
    public toast: ToastrService,
    private appconfig: AppConfigService,
    private ga_service: GoogleAnalyticsService,

  ) {
    this.userDetails = JSON.parse(this.appConfig.getLocalStorage('userDetails'));
  }
  ngOnInit() {
    this.util.cartSubject.next(true);
    this.route.queryParams.subscribe(params => {
      const postData: any = {};
      if (params.orderId) {
        postData.order_id = atob(params.orderId);
        this.catalog.getOrder(postData).subscribe((data: any) => {
          if(data?.success){
            this.orderlist = data.data;
            this.syncLxp();

            // ###Google Analytics###
            let ga_items = []
            let grandTotal = 0
            this.orderlist.forEach(item => {
              ga_items.push(
              {
                item_id: item.cid,
                item_name: item.assessmentName,
                price: item.totalPrice,
                quantity: 1,
                currency: "INR",
              }
            )
            grandTotal = item.totalPrice + grandTotal;
            });

            let ga_params = {
              transaction_id:params.orderId,
              value: grandTotal,
              tax:0,
              currency: "INR",
              items:ga_items
            }
            this.ga_service.gaEventTrgr("purchase",  "a user has completed a purchase.", "checkout", ga_params)
            // ###Google Analytics###
          }
          else{
            this.toast.warning(data?.message ? data?.message :'Something Went Wrong')
          }
        });
      }
    });
  }
  syncLxp(){
    this.course_details = [];
    this.stepCourseId = [];
    this.orderlist.forEach(element => {
      if(element?.productType == 'course' && element?.courseType == 'English'){
        this.stepCheck = true;
        this.stepCourseId.push({
          id:element?.cid,
          course_grants:element?.course_grants
        });
      }
     else if(element?.productType == 'course' && element?.courseType != 'English'){
        this.lxpCheck = true;
          const courseData ={
            courseIds: element?.courseType =='Track' ? element?.categoryIds : [element?.cid],
            courseType: element?.courseType,
            trackName:  element?.trackName ? element?.trackName : '',
            trackId:  element?.trackId ? element?.trackId :'',
            batchId : element?.batchId ? element?.batchId:''
          }
          this.course_details.push(courseData);
      }
    });

    if(this.lxpCheck){
      const apiParam = {
        username: this.userDetails.email,
        course_details: this.course_details
        }
      this.catalog.userSyncUpLxp(apiParam).subscribe((result:any)=>{
        if(result?.success){
          this.util.isEnrolled.next(true);
        }
      });
    }
    if(this.stepCheck){
      const stepapiParam ={
        user_details:[{email:this.userDetails.email}],
        course_details:this.stepCourseId
      }
      this.catalog.stepCrsFrmMicrocert(stepapiParam).subscribe((result:any)=>{
      });
    }
  }
  openDialog(templateRef: TemplateRef<any>, orderItem) {
    let dialogData = {
      cid: orderItem.cid,
      assesmentName: orderItem.assessmentName,
      competencyName: orderItem.competencyName,
      levelName: orderItem.levelName,
      orderNo: orderItem.orderNo,
      callingFrom:'SP'
    }
    this.dialog.open(BookSlotComponent, {
      width: '65%',
      height: '65%',
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'bookSlotContainer',
      data: dialogData,
    });
    this.currentCid = orderItem.cid;
    this.assesmentName = orderItem.assessmentName;
    this.competencyName = orderItem.competencyName;
    this.levelName = orderItem.levelName;
    this.orderId = orderItem.orderNo;
  }
  goToCourse(course){
    if(course.courseType == 'English'){
      this.catalog.getStepRedirectUrl(this.userDetails.email,course.cid).subscribe((result:any)=>{
        if(result?.success){
          window.open(result?.stepRedirectUrl,'redirection');
        }
        else{
          this.toast.warning(result?.message);
        }
      })
    }
    else{
      var ValueData = JSON.parse(this.appconfig.getLocalStorage('valueData'));
      window.open(environment.lxp_url+"?queValue="+encodeURIComponent(ValueData.queValue)+'&rpValue='+encodeURIComponent(ValueData.rpValue)+'&dpValue=microsetportal', '_self');
    }
  }

  // reschedule(item){

  // }


}
