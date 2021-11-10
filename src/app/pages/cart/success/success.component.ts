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

  ) {
    this.userDetails = JSON.parse(this.appConfig.getSessionStorage('userDetails'));
  }
  ngOnInit() {
    this.util.cartSubject.next(true);
    this.route.queryParams.subscribe(params => {
      const postData: any = {};
      if (params.orderId) {
        postData.order_id = params.orderId;
        this.catalog.getOrder(postData).subscribe((data: any) => {
          this.orderlist = data.data;
        });
      }
    });
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
 

  // reschedule(item){

  // }

}
