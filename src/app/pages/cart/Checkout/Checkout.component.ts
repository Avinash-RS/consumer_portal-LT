import { Component, ElementRef, OnInit, ViewChild, Input, ChangeDetectionStrategy } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { CartService } from "src/app/services/cart.service";
import { CatalogService } from "src/app/services/catalog.service";
import { UtilityService } from "src/app/services/utility.service";
import { AppConfigService } from "src/app/utils/app-config.service";
import { environment } from '@env/environment';
import { LoadingService } from "src/app/services/loading.service";
import { GoogleAnalyticsService } from "src/app/services/google-analytics.service";

@Component({
  selector: "app-Checkout",
  templateUrl: "./Checkout.component.html",
  styleUrls: ["./Checkout.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default
})

export class CheckoutComponent implements OnInit {
  @ViewChild('form') form: ElementRef;
  // cartList:any=[];
  @Input('tab') currentTab: any;
  @Input('checkoutData') cartList: any;
  @Input('cartTotal') cartAmount: any;
  encRequestRes: any;
  //accessCode = 'AVFQ92HF95BT32QFTB'; Sufin accessCode
  accessCode:any;//Lntiggnite accessCode
  selectedAddress: any;
  totalPrice = 0;
  userDetails: any;
  subsContent: any;
  constructor(
    private catalogService: CatalogService,
    private cartService: CartService,
    private util: UtilityService,
    public toast: ToastrService,
    private appconfig: AppConfigService,
    private _loading: LoadingService,
    private ga_service: GoogleAnalyticsService,

  ) {
    this.subsContent = this.util.addressSubject.subscribe((data: any) => {
      this.selectedAddress = data
    });
  }

  ngOnInit() {
    this.userDetails = JSON.parse(this.appconfig.getLocalStorage('userDetails'));
    this.totalCalculator();
  }
  ngOnChanges(data: any) {
    this.cartList = data.cartList.currentValue;
    this.totalPrice = data.cartAmount.currentValue

    this.totalCalculator()
  }

  ngOnDestroy() {
    this.subsContent.unsubscribe();
  }

  totalCalculator() {
    this.cartList = this.cartList ? this.cartList : [];
    this.totalPrice = this.totalPrice;
    //console.log(this.cartList);
    //console.log(this.cartAmount,this,this.totalPrice,'price')
    // console.log(this.cartList)
    // this.cartList.forEach((list) => {
    //   list.assessmentDetails.sellingPrice = parseInt(list.assessmentDetails.sellingPrice)
    //   if(!list.assessmentDetails.is_free){
    //   this.totalPrice += list.assessmentDetails.sellingPrice
    //   }
    // })
  }
  continueClick() {
    this.currentTab.next();
  }
  checkout() {
    if (this.cartList?.length == 0){
      this.toast.warning('Add items in cart to checkout');
      return false;
    }
    let param: any = {}
    param.user_id = this.userDetails.userId;
    param.email = this.userDetails.email;
    param.cart = [];
    this.cartList.forEach(cartItem => {
      param.cart.push(
        {
          assessmentId: cartItem.assessmentId,
          batchId:cartItem?.batchId ? cartItem.batchId :null
        }
      )
    });
    if (this.selectedAddress) {
      param.addressId = this.selectedAddress.addressId
      this.catalogService.createOrder(param).subscribe((data: any) => {
        this._loading.setLoading(true, environment.API_BASE_URL+"createorder");
        if(this.totalPrice!==0){
            this.encRequestRes = data['message'];
            this.accessCode = data['accesscode'];
            setTimeout(() => {
              this.form.nativeElement.submit();
              this.ga_service.gaEventTrgr("begin_checkout",  "a user has begun a checkout.", "checkout", data.orderId)
            }, 1000)
        }else{
          this._loading.setLoading(false, environment.API_BASE_URL+"createorder");
          this.appconfig.routeNavigationWithQueryParam("cart/success",{ orderId: btoa(data.orderId) });
          this.ga_service.gaEventTrgr("begin_checkout",  "a user has begun a checkout.", "checkout", {transaction_id:data.orderId})
        }
      })
    } else {
      this.toast.error('Add an address to continue');
    }

  }
}
