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
    console.log(this.userDetails)
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
    param.order_amount = this.totalPrice;
    param.cart = [];
    this.cartList.forEach(cartItem => {
      let itemTotal_amount = cartItem.quantity * cartItem.assessmentDetails.is_free?0:cartItem.assessmentDetails.sellingPrice;
      var producttype = cartItem?.productType == 'course' ? 'course' : 'assessment';
      param.cart.push(
        {
          assessmentId: cartItem.assessmentId,
          quantity: Number(cartItem.quantity),
          amount_per_assessment: cartItem.assessmentDetails.is_free?0:cartItem.assessmentDetails.sellingPrice,
          total_amount: itemTotal_amount,
          competencyId: cartItem.competencyDetails.cid,
	        levelId: cartItem.competencyDetails.levelId,
          productType : producttype
        }
      )
    });
    console.log(param)
    if (this.selectedAddress) {
      this.catalogService.createOrder(param).subscribe((data: any) => {
        this._loading.setLoading(true, environment.API_BASE_URL+"createorder");
        if(this.totalPrice!==0){
        //let redirect_url = 'http%3A%2F%2Flocalhost%3A3008%2Fhandleresponse';
        let redirect_url =environment.PAYMENT+'/ccavResponseHandler'
        let useremail = this.userDetails.email;
        let request = `merchant_id=392494&order_id=${data.order_id}&currency=INR&amount=${this.totalPrice}&redirect_url=${redirect_url}&cancel_url=${redirect_url}&language=EN&billing_name=${this.selectedAddress.name}&billing_address=${this.selectedAddress.addressLine1}&billing_city=${this.selectedAddress.city.cityName}&billing_state=${this.selectedAddress.state.stateName}&billing_zip=${this.selectedAddress.pincode}&billing_country=India&billing_tel=${this.selectedAddress.mobile}&delivery_name=${this.selectedAddress.name}&delivery_address=${this.selectedAddress.addressLine1}&delivery_city=${this.selectedAddress.city.cityName}&delivery_state=${this.selectedAddress.state.stateName}&delivery_zip=${this.selectedAddress.pincode}&delivery_country=India&delivery_tel=${this.selectedAddress.mobile}&billing_email=${useremail}`
        this.catalogService.encryptdata(request).subscribe(
          data => {
            // this.cartService.removeCartDetails({cartId:this.cartList[0].cartId}).subscribe((data:any)=>{
            //   console.log("cart Cleard");
            // });
            console.log('---------------------', data['message'])
            this.encRequestRes ='858ece0154743498aaaac5f41456c922126ae65bad1e940ca6a8202a328f138917ea1f0d2d01835afbfb04c047f21d3e722d25099a0b2ce76a0f0da65b0f3336c45c25cf0331fff5cf2a70e7f65f509ee1bc184e230531c304b3d2a0734b67121080dbdd3fd9e88755219cd59cbde3e46121c37dd21253815c53f5d967fa84b27af2fffd278afa04477c108f250c18848f11c76e555c3e493ff4da1a3249f6aaadd87caf0506f7f80826a2cfe0576e96241437f024868b02a5d1893c318f2451aaf56e443b1df497f72885158559ed853e66283c0f7f631e2b2aaa0735aa28981c0293c43ee94443b6df257788f4d66192824525119ff09c765384388b73a942ea69499dbfd9d657ec3dca6482dc9003e43aa59da1152fb7719cecfa5a9793f9fbc35329ee50d021203eaa2a645ee61b2706592a75f7115545314c6044a1ca424a52ac72ee208eef1107cf7717d8177ea9af1182790cef05bff47902273a48e8ebe3b8e0324ae3e8b58ef50e2737cf2c986f5898a67554065412f91c73deb2fdadfb9dd7a83a918a2ecad4cf15eb1505074d40963dc65060bc2e036f979615a5ac371b96b1b57fba437c4bfb1d0e5dc9a8344c3fe320a06c7bda72f0ad7fd60968074bfcf967d8cf311c38b049cfefe38f7beb52bd85e86e97055f5aa22ebac4d7fd0dbfdb8745e6198847aa7528373c1312b27e861f21c1125f290fc7ce1ff8255c7feb73798ef31458212e3bf321912f52fa95ce8566058cfef7e848146bc8139bdea37ec0fbec5ee1fe9e923fffe061b286c98a5ee9d24dd952da8e43429238114c0a774c99b22b798d543293a82dea4d08bfd2524fbda4ed1eb778e773fa5d85ba5d1caa06ff878ed715a347730d7b77066ed5e99ddb3feca2c6b78ae1b53716428e5313d071368c65029c0015b5465bb80ff404673945fee2edbb31106834eb576a66ae5a0e587139bdbe8ff0b410a218ecf8a5974178a45f3a91c075a09816dfdfa63abc9730fecda52c3da7253f830b262b2240f69ce920097f8fdffd9dcafb09ba9905e3225e48b61aa4c68cfcaa18cad9235e3252d2213fd24608dd' //data['message'];
            this.accessCode ='AVXK04IL06AS30KXSA' //data['accessCode'];
            setTimeout(() => {
              this.form.nativeElement.submit();
            }, 1000)
          }, error => {
            console.log(error);
          }
        );
        }else{
          this._loading.setLoading(false, environment.API_BASE_URL+"createorder");
          this.appconfig.routeNavigationWithQueryParam("cart/success",{ orderId: data.order_id });
          // cart/success?orderId=6313-311893-1133
          // navigate to this section
        }
      })
    } else {
      this.toast.error('Select an address to continue')
    }

  }
}
