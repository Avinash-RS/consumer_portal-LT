import { Component, Inject, OnInit } from "@angular/core";
import { OwlOptions } from 'ngx-owl-carousel-o';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { APP_CONSTANTS } from "src/app/utils/app-constants.service";
import { AppConfigService } from "src/app/utils/app-config.service";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { CatalogService } from "src/app/services/catalog.service";
import { UtilityService } from "src/app/services/utility.service";

@Component({
  selector: "app-bookSlot",
  templateUrl: "./bookSlot.component.html",
  styleUrls: ["./bookSlot.component.scss"]
})

export class BookSlotComponent implements OnInit {
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
    },
    startPosition:0
  };
  
  minDate = new Date();
  slotDate: any = this.minDate;
  testData: any;
  currentCid: any;
  assesmentName: any;
  userDetails: any;
  levelName: any;
  competencyName: any;
  orderId: any;
  reSchedule: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private appConfig: AppConfigService,
    private dialog: MatDialog,
    public route: ActivatedRoute,
    private util: UtilityService,
    private catalog: CatalogService,
    public toast: ToastrService
  ) { this.userDetails = JSON.parse(this.appConfig.getSessionStorage('userDetails')); }

  ngOnInit() {
    this.data.selectedindex = (this.data.selectedindex !== 'undefinded') ? 0 : this.data.selectedindex;
    this.owlCarouselOptions.startPosition = this.data.selectedindex;
    this.currentCid = this.data.cid;
    this.assesmentName = this.data.assessmentName;
    this.competencyName = this.data.competencyName;
    this.levelName = this.data.levelName;
    this.orderId = this.data.orderNo;
    this.reSchedule = this.data.reSchedule;    
    this.getSlotDetails(this.data.cid);    
  }

  slotClose() {
     this.dialog.closeAll();
  }
  gotoMyAsseessment() {
    this.slotClose();
    this.appConfig.routeNavigation(APP_CONSTANTS.ROUTES.myAssessment);
  }

  selectSlot(fullSlots, slotitem) {
    fullSlots.slot.forEach(element => {
      element.isSelected = false;
    });
    slotitem.isSelected = true;
    fullSlots.bookingData.selectedSlot = slotitem;
  }

  getSlotDetails(cid) {

    const param = {
      cid: cid,
      date: this.minDate,
      email: this.userDetails.email
    };
    this.catalog.checkingslot(param).subscribe((rdata: any) => {
      this.testData = rdata.data;
      if (this.testData.length) {
        this.testData.forEach(element => {
          element.testTypes.bookingData = {};
          if(this.reSchedule !== 'undefinded' && this.reSchedule === 1){
            element.testTypes.scheculeViewStatus = false;
          }else{
            element.testTypes.scheculeViewStatus = element.testTypes.scheculeStatus?true:false;
          }
          
          if (element.testTypes.scheculeStatus) {
            // console.log(moment(element.testTypes.startDateTime).utc().format("hh:mm A"))
            element.testTypes.scheduleDate = moment(element.testTypes.startDateTime).format('DD/MM/YYYY');
            element.testTypes.scheduleTime = moment(element.testTypes.startDateTime).format('hh:mm A');
          } else {
            element.testTypes.slot.forEach(slotitem => {
              this.checkSlotExpired(slotitem, this.minDate);
            });
          }
          // element.testTypes.bookingData.selectedDate = this.minDate;

        });
      }
    });
  }

  fetchSlotbyTask(event, taskDetail) {

    if (taskDetail?.bookingData?.selectedSlot) {
      delete taskDetail.bookingData.selectedSlot;
    }
    // this.selectedDate = new Date(event.value)
    taskDetail.bookingData.selectedDate = new Date(event.value);

    const param = {
      cid: this.currentCid,
      date: event.value,
      taskid: String(taskDetail.taskId),
      email: this.userDetails.email
    };

    this.catalog.checkingslottestwise(param).subscribe((rdata: any) => {
      // taskDetail.scheculeViewStatus = rdata.data[0].testTypes.scheculeStatus?true:false;
      taskDetail.slot = rdata.data[0].testTypes.slot;
      rdata.data[0].testTypes.slot.forEach(element => {
        this.checkSlotExpired(element, taskDetail.bookingData.selectedDate);
      });
      // console.log(taskDetail);
    });
  }
  checkSlotExpired(element, bookedDate) {
    let dateVal = moment(bookedDate).format('YYYY-MM-DD');
    let currentEpoc = + this.minDate;
    let slotDateEpoc = + new Date(dateVal + ' ' + element.key);
    console.log(slotDateEpoc, currentEpoc);
    if (slotDateEpoc > currentEpoc) {
      element.isSlotExpired = false;
    } else {
      element.isSlotExpired = true;
    }
  }
  submitSelectedSlot(testItem) {
    let userDetails: any = JSON.parse(this.appConfig.getSessionStorage('userDetails'));
    console.log(userDetails);
    let dateVal = moment(testItem.testTypes.bookingData.selectedDate).format('YYYY-MM-DD');
    let slotDateTime = new Date(dateVal + ' ' + testItem.testTypes.bookingData.selectedSlot.key);
    let utcformatted = moment(slotDateTime).utc(true).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    const param = {
    startTime: moment(utcformatted).subtract(5, 'hours').subtract(30, 'minutes').toISOString(),
    // endTime: "2021-06-06T13:00:00Z",
    email: userDetails.email,
    orderId: this.orderId,
    taskId: testItem.testTypes.taskId,
    type: testItem.testTypes.type,
    packageTemplateId: testItem.packageTemplateId,
    taskName: testItem.testTypes.testName,
    duration: Number(testItem.testTypes.totalDuration),
    firstName: userDetails.firstname,
    lastName: userDetails.lastname,
    userId: userDetails.userId,
    status: testItem.testTypes.scheculeStatus ? 'reschedule' : 'schedule'
  };
    if (testItem.testTypes?.bookingData?.selectedSlot) {
      this.checkSlotExpired(testItem.testTypes.bookingData.selectedSlot, testItem.testTypes.bookingData.selectedDate);
      if (testItem.testTypes.bookingData.selectedSlot.isSlotExpired) {
        this.toast.error('Slot booking time expired.');
        this.getSlotDetails(this.currentCid);
      }
      else {
        if (testItem.testTypes.scheculeStatus) {
          let rescheParam: any = {};
          rescheParam.email = userDetails.email;
          rescheParam.taskId = testItem.testTypes.taskId;
          rescheParam.packageTemplateId = testItem.packageTemplateId;
          rescheParam.startDateTime = moment(utcformatted).subtract(5, 'hours').subtract(30, 'minutes').toISOString();

          this.catalog.rescheduleAssessment(rescheParam).subscribe((rdata: any) => {
            if (rdata.success) {
              this.getSlotDetails(this.currentCid);
              this.toast.success(rdata.message);
            } else {
              this.toast.error(rdata.message);
            }
          });
        } else {
          this.catalog.scheduleAssessment(param).subscribe((rdata: any) => {
            console.log(rdata);
            if (rdata.success) {
              this.getSlotDetails(this.currentCid);
              this.toast.success(rdata.message);
            } else {
              this.toast.error(rdata.message);
            }
          });
        }
      }


    } else {

    }
  }
}
