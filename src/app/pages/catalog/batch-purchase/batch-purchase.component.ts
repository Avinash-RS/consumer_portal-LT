import { Component, OnInit } from '@angular/core';
import { APP_CONSTANTS } from 'src/app/utils/app-constants.service';
import { AppConfigService } from 'src/app/utils/app-config.service';
import { ActivatedRoute } from '@angular/router';
import { CatalogService } from 'src/app/services/catalog.service';
import { UtilityService } from 'src/app/services/utility.service';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';

@Component({
  selector: 'app-batch-purchase',
  templateUrl: './batch-purchase.component.html',
  styleUrls: ['./batch-purchase.component.scss'],
})
export class BatchPurchaseComponent implements OnInit {
  userDetails;
  domainId;
  areaId;
  productType;
  abouCourseData: any;
  courseData;
  programDetails;
  bannerContent;
  hPartners;
  nocard: boolean = true;
  defaultDiv:boolean = true;
  selectedBatchId: string = '';
  constructor(
    private appconfig: AppConfigService,
    private route: ActivatedRoute,
    private catalogService: CatalogService,
    private util: UtilityService,
    public toast: ToastrService
  ) {}

  ngOnInit() {
    this.userDetails = JSON.parse(
      this.appconfig.getLocalStorage('userDetails')
    );
    this.route.queryParams.subscribe((params) => {
      this.domainId = atob(params.selectedTab);
      this.areaId = atob(params.id);
      this.productType = atob(params.productType);
      this.getAbouCourse();
    });
  }

  getAbouCourse() {
    var params = {
      competencyId: this.areaId,
      productType: 'course',
    };
    this.catalogService.getAssesments(params).subscribe((response: any) => {
      if (response.success) {
        if (
          response.data &&
          response.data.length > 0 &&
          response.data[0].assessmentData &&
          response.data[0].assessmentData.length
        ) {
          this.abouCourseData = response.data[0];
          this.bannerContent = this.abouCourseData.assessmentData[0];
          this.courseData = this.abouCourseData.assessmentData[0].batchDetails;
          this.programDetails = this.abouCourseData.assessmentData[0].programDetails;
          this.hPartners = this.bannerContent?.courseContents?.Headings.filter(e => e.sectionId == 11)[0];
          this.nocard = false;
          this.defaultDiv = false;
          this.courseData.forEach((e) => {
            this.getTimer(e);
          });
        } else {
          this.abouCourseData = [];
          this.nocard = true;
          this.defaultDiv = false;
        }
      } else {
        this.abouCourseData = [];
        this.nocard = true;
        this.defaultDiv = false;
      }
    });
  }

  getTimer(filobject) {
    var countDownDate = new Date(filobject.enrollmentClosesOn).getTime();

    var x = setInterval(() => {
      var now = new Date().getTime();
      var distance = countDownDate - now;
      filobject.timer = {};
      filobject.timer.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      filobject.timer.hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      filobject.timer.mins = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      );
      filobject.timer.secs = Math.floor((distance % (1000 * 60)) / 1000);
      filobject.timer.isExpired = false;

      if (distance < 0) {
        clearInterval(x);
        filobject.timer = {};
        filobject.timer.isExpired = true;
      }
    }, 1000);
  }

  getBatchId(ele) {
    this.selectedBatchId = ele.batchId;
  }

  courseBuy() {
    //signin check
    if (this.userDetails) {
      const data = {
        noofFields: '44',
        email: this.userDetails.email ? this.userDetails.email : null,
      };
      var cartParams = {
        isLevel: false,
        levelId: this.abouCourseData?.levelId,
        userId: this.userDetails.userId,
        assessmentId: this.areaId,
        competencyId: this.areaId,
        productType: this.productType,
        batchId:this.selectedBatchId
      };
      //Add to Cart
      this.catalogService.addToCart(cartParams).subscribe((response: any) => {
        if (response.success) {
          //is Free check
          if (this.abouCourseData?.is_free) {
            this.freeOrderPlace(response?.data[0].cartId);
          } else {
            this.toast.success('Added to cart');
            this.util.cartSubject.next(true);
          }
        } else {
          this.toast.warning(response.message);
        }
      });
    } else {
      cartParams = {
        isLevel: false,
        levelId: this.abouCourseData?.levelId,
        userId: '',
        assessmentId: this.areaId,
        competencyId: this.areaId,
        productType: this.productType,
        batchId:this.selectedBatchId
      };
      this.util.setValue(cartParams);
      this.appconfig.routeNavigationWithQueryParam(
        APP_CONSTANTS.ENDPOINTS.onBoard.login,
        { fromPage: '0' }
      );
    }
  }
  freeOrderPlace(cartid) {
    let freeCart = [];
    freeCart.push({
      assessmentId: this.areaId,
      batchId:this.selectedBatchId
    });
    let orderParms = {
      user_id: this.userDetails.userId,
      cartId: cartid,
      cart: freeCart,
    };
    this.catalogService.createOrder(orderParms).subscribe((data: any) => {
      if (data?.success) {
        this.toast.success('Course order created');
        this.appconfig.routeNavigationWithQueryParam('cart/success', {
          orderId: btoa(data.orderId),
        });
      } else {
        this.toast.warning(
          data?.message ? data?.message : 'Some thing went wrong'
        );
      }
    });
  }
}
