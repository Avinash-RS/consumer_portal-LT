import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CatalogService } from "../../../services/catalog.service";
import { ToastrService } from 'ngx-toastr';
import { AppConfigService } from 'src/app/utils/app-config.service';
import { APP_CONSTANTS } from "src/app/utils/app-constants.service";
import { UtilityService } from 'src/app/services/utility.service';
import { MatStepper } from '@angular/material/stepper';
import Swal from 'sweetalert2';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {
  @ViewChild('form') form: ElementRef;
  @ViewChild('stepper') private myStepper: MatStepper;

  encRequestRes: any;
  order_no: any = 'qaz234567';
  testAmount: any = '10';
  selectedAddress: any = {
    name: 'testing',
    address: 'test address',
    city: 'test city',
    pincode: '23456',
    state: 'state test',
    phone: '1234567890'
  }
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isReadMore = true;
  userDetails;
  cartList = [];
  batchInfo = false;
  totalAmount = 0;
  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private catalogService: CatalogService, public toast: ToastrService,
    private appconfig: AppConfigService, private appConfig: AppConfigService,
    private util: UtilityService,
    private ga_service: GoogleAnalyticsService,
  ) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(this.appconfig.getLocalStorage('userDetails'));
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.getCart()
    this.ga_service.gaSetPage("Cart",{})//Google Analytics
  }
  getCart() {
    var params = {
      "userId": this.userDetails.userId
    }
    this.catalogService.getCart(params).subscribe((response: any) => {
      if (response.data.length > 0 && response.success) {
        this.cartList = response.data;
        this.totalAmount = response.totalPrice
      } else {
        this.cartList = [];
      }

      let ga_items = []
      this.cartList.forEach(item => {
        ga_items.push({
            item_id: item.assessmentDetails.cid,
            item_name: item.assessmentDetails.name,
            currency: "INR",
            price: item.assessmentDetails.sellingPrice,
            quantity: 1
          })
      });

    let ga_params = {
      currency: "INR",
      value: this.totalAmount,
      items: ga_items
    }

      // ### Google Analytics for View_Cart ###
      this.ga_service.gaEventTrgr("view_cart", "Get user's cart items", "View", ga_params)
    })
  }

  stepnext(stepper: MatStepper){
    stepper.next();
  }
  showText() {
    this.isReadMore = !this.isReadMore
  }

  toCatalogue() {
    this.appconfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.home, { fromPage: btoa("viewAll"), selectedTab: btoa('All') });
  }

  removeAssessment(item) {

    Swal.fire({
      customClass: {
        container: 'swalClass',
      },
      title: 'Are you sure you want to remove the item from cart?',
      showCancelButton: true,
      confirmButtonColor: '#ffffff',
      cancelButtonColor: '#ffffff',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if(result.isConfirmed){
        var params = {
          "userId": this.userDetails.userId,
          "cartId": item.cartId
        }
        this.catalogService.removeFromCart(params).subscribe((response: any) => {
          if (response.success) {
            this.toast.success(response.message);
            this.util.cartSubject.next(true);
            this.getCart();
            //analytics event START
          let ga_params:any = {
            currency: "INR",
            value: item.assessmentDetails.sellingPrice,
            items: [
              {
                item_id: item.assessmentDetails.cid,
                item_name: item.assessmentDetails.name,
                price: item.assessmentDetails.sellingPrice,
                quantity: 1,
                currency: "INR",
              }
            ]
          }
          this.ga_service.gaEventTrgr("remove_from_cart", "remove_from_cart", "Click", ga_params);
          //analytics event END
          } else {
            this.toast.warning('Something went wrong')
          }
        })
      }
    });
  }
//page view for address selection
ga_pageview(event){
  if(event.selectedIndex==0)
  {
    this.ga_service.gaSetPage("Cart",{})//Google Analytics
  }else{
    this.ga_service.gaSetPage("Address Selection",{})//Google Analytics
  }
}
}
