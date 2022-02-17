import { Component, ElementRef, OnInit, ViewChild, Input, ChangeDetectionStrategy } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { CartService } from "src/app/services/cart.service";
import { CatalogService } from "src/app/services/catalog.service";
import { UtilityService } from "src/app/services/utility.service";
import { AppConfigService } from "src/app/utils/app-config.service";
import { environment } from '@env/environment';
import { LoadingService } from "src/app/services/loading.service";

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
  ) {
    this.subsContent = this.util.addressSubject.subscribe((data: any) => {
      this.selectedAddress = data
    });
  }

  ngOnInit() {
    this.userDetails = JSON.parse(this.appconfig.getSessionStorage('userDetails'));
    this.totalCalculator();
  }
  ngOnChanges(data: any) {
    console.log("change detected", data);
    this.cartList = data.cartList.currentValue;
    this.totalCalculator()
  }

  ngOnDestroy() {
    this.subsContent.unsubscribe();
  }

  totalCalculator() {
    this.totalPrice = 0
    this.cartList = this.cartList ? this.cartList : [];
    console.log(this.cartList)
    this.cartList.forEach((list) => {
      list.assessmentDetails.sellingPrice = parseInt(list.assessmentDetails.sellingPrice)
      if(!list.assessmentDetails.is_free){
      this.totalPrice += list.assessmentDetails.sellingPrice
      }
    })
    console.log(this.totalPrice)
  }
  continueClick() {
    this.currentTab.next();
  }
  checkout() {
    let param: any = {}
    param.user_id = this.userDetails.userId;
    param.email = this.userDetails.email;
    // param.order_amount = this.totalPrice;
    param.cart = [];
    this.cartList.forEach(cartItem => {
      // let itemTotal_amount = cartItem.quantity * cartItem.assessmentDetails.is_free?0:cartItem.assessmentDetails.sellingPrice;
      // var producttype = cartItem?.productType == 'course' ? 'course' : 'assessment';
      param.cart.push(
        {
          assessmentId: cartItem.assessmentId,
          // quantity: Number(cartItem.quantity),
          // amount_per_assessment: cartItem.assessmentDetails.is_free?0:cartItem.assessmentDetails.sellingPrice,
          // total_amount: itemTotal_amount,
          // competencyId: cartItem.competencyDetails.cid,
	        // levelId: cartItem.competencyDetails.levelId,
          // productType : producttype
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
            }, 1000)
        // let redirect_url = environment.PAYMENT+'/ccavResponseHandler'
        // let useremail = this.userDetails.emailId;
        // let request = `merchant_id=261628&order_id=${data.order_id}&currency=INR&amount=${this.totalPrice}&redirect_url=${redirect_url}&cancel_url=${redirect_url}&language=EN&billing_name=${this.selectedAddress.name}&billing_address=${this.selectedAddress.addressLine1}&billing_city=${this.selectedAddress.city.cityName}&billing_state=${this.selectedAddress.state.stateName}&billing_zip=${this.selectedAddress.pincode}&billing_country=India&billing_tel=${this.selectedAddress.mobile}&delivery_name=${this.selectedAddress.name}&delivery_address=${this.selectedAddress.addressLine1}&delivery_city=${this.selectedAddress.city.cityName}&delivery_state=${this.selectedAddress.state.stateName}&delivery_zip=${this.selectedAddress.pincode}&delivery_country=India&delivery_tel=${this.selectedAddress.mobile}&billing_email=${useremail}`
        // this.catalogService.encryptdata(request).subscribe(
        //   data => {
        //     this.encRequestRes = data['message'];
        //     this.accessCode = data['accessCode'];
        //     setTimeout(() => {
        //       this.form.nativeElement.submit();
        //     }, 1000)
        //   }, error => {
        //     console.log(error);
        //   }
        // );
        }else{
          this._loading.setLoading(false, environment.API_BASE_URL+"createorder");
          this.appconfig.routeNavigationWithQueryParam("cart/success",{ orderId: btoa(data.orderId) });
        }
      })
    } else {
      this.toast.error('Select an address to continue')
    }

  }
}
