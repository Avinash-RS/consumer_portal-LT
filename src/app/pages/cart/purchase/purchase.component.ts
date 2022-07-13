import { Component, OnInit, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CatalogService } from "../../../services/catalog.service";
import { ToastrService } from 'ngx-toastr';
import { AppConfigService } from 'src/app/utils/app-config.service';
import { APP_CONSTANTS } from "src/app/utils/app-constants.service";
import { UtilityService } from 'src/app/services/utility.service';
import { MatStepper } from '@angular/material/stepper';
import Swal from 'sweetalert2';
import { environment } from '@env/environment';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { GlobalValidatorService } from 'src/app/services/global-validator.service';
import { CartService } from 'src/app/services/cart.service';
import { LoadingService } from 'src/app/services/loading.service';
@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {
  @ViewChild('form') form: ElementRef;
  @ViewChild('stepper') myStepper: MatStepper;

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
  gstAmount = 0;

  //Address
  addressList: any;
  radioChecked: number = 0;
  SelectedIndex: any;
  isEdit: any;
  districtList: any = [];
  addressItemData: any = {};
  addressEntryForm: FormGroup;
  tagList: any = [];
  tagName: any = [];
  stateList: any = [];
  originAddessTag: string = '';

  //Checkout
  //accessCode = 'AVFQ92HF95BT32QFTB'; Sufin accessCode
  accessCode:any;//Lntiggnite accessCode
  amountGst: any;
  cartAmount: any;
  currentTab = 0;
  totalPrice = 0;
  totalCartPrice = 0;
  subsContent: any;

  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private catalogService: CatalogService, public toast: ToastrService,
    private appconfig: AppConfigService, private appConfig: AppConfigService,
    private util: UtilityService,
    private ga_service: GoogleAnalyticsService, 
    private glovbal_validators: GlobalValidatorService, 
    private cartService: CartService,
    private _loading: LoadingService,
  ) { 
    this.subsContent = this.util.addressSubject.subscribe((data: any) => {
      this.selectedAddress = data
    });
  }

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

    this.addressFormInitialize();
    this.getAddress();
    this.getState()
    this.getaddressTags()
  }
  // ngOnChanges(){
  //   this.getCart();
  // }
  getCart() {
    var params = {
      "userId": this.userDetails.userId
    }
    this.catalogService.getCart(params).subscribe((response: any) => {
      if (response.data.length > 0 && response.success) {
        this.cartList = response.data;
        this.gstAmount = response.gstPrice;
        this.totalCartPrice = 0;
        this.cartList.forEach((list) => {
          list.assessmentDetails.sellingPrice = parseInt(list.assessmentDetails.sellingPrice)
          if(!list.assessmentDetails.is_free){
          this.totalCartPrice += list.assessmentDetails.sellingPrice
          }
        })
      } else {
        this.cartList = [];
        this.totalCartPrice = 0;
        this.gstAmount = 0;
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
        value: this.totalCartPrice,
        items: ga_items
      }
      // ### Google Analytics for View_Cart ###
      this.ga_service.gaEventTrgr("view_cart", "Get user's cart items", "View", ga_params);
    })
  }
  // ngOnDestroy() {
  //   this.subsContent.unsubscribe();
  // }
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
      this.currentTab = 0;
      this.ga_service.gaSetPage("Cart",{})//Google Analytics
    }else{
      this.currentTab = 1;
      this.ga_service.gaSetPage("Address Selection",{})//Google Analytics
    }
  }

  addressFormInitialize() {
    this.originAddessTag = '';
    if (this.isEdit) {
      this.originAddessTag = this.addressItemData?.addressTag?.addressTagName;
      this.addressEntryForm = this._formBuilder.group({
        name: [this.addressItemData?.name, [Validators.required , this.glovbal_validators.noWhitespaceValidator]],
        mobile: [this.addressItemData?.mobile, [Validators.required, this.glovbal_validators.mobileRegex()]],
        addresslines: [this.addressItemData?.addressLine1, [Validators.required  ,this.glovbal_validators.address255()]],
        city: [this.addressItemData?.city, [Validators.required]],
        state: [this.addressItemData?.state, [Validators.required]],
        pincode: [this.addressItemData?.pincode, [Validators.required,this.glovbal_validators.zipOnly()]],
        addressTag: [this.addressItemData?.addressTag, [Validators.required]],
      });
    } else {
      this.addressEntryForm = this._formBuilder.group({
        name: ['', [Validators.required , this.glovbal_validators.noWhitespaceValidator]],
        mobile: ['', [Validators.required,this.glovbal_validators.mobileRegex()]],
        addresslines: ['', [Validators.required, this.glovbal_validators.address255()]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        pincode: ['', [Validators.required,this.glovbal_validators.zipOnly()]],
        addressTag: ['', [Validators.required]],
      });
    }
  }

  getAddress() {
    let getparams = { userId: this.userDetails.userId }
    this.cartService.getAddressByUserid(getparams).subscribe((data: any) => {
      this.addressList = data.data;
      this.tagName = [];
      this.addressList.forEach((value) => {
        this.tagName.push(value.addressTag.addressTagName);
      });
      if(this.addressList){
        this.SelectedIndex = this.addressList[0];
      } else {
        this.SelectedIndex = null;
      }
      this.util.addressSubject.next(this.SelectedIndex);
    });
  }
  getaddressTags() {
    this.cartService.getAddressTag().subscribe((data: any) => {
      this.tagList = data.data
    })
  }
  getDistrict(param) {
    this.cartService.getDistrictDetails(param).subscribe((data: any) => {
      this.districtList = data.data
    })
  }
  getState() {
    let param = {
      countryId: "5bd0597eb339b81c30d3e7f2"
    }
    this.cartService.getStateDetails(param).subscribe((data: any) => {
      this.stateList = data.data
    })
  }
  stateIdFetcher(data) {
    let param = {
      countryId: data.country,
      stateId: data._id
    }
    this.getDistrict(param);
    this.addressEntryForm.get('city').setValue(null)
  }

  addOrUpdateAddress(Updateflag: boolean) {
    let postParam: any = {}
    postParam.isUpdate = Updateflag;
    if (Updateflag) { postParam.addressId = this.SelectedIndex.addressId; }

    let tagname = this.addressEntryForm.value.addressTag.addressTagName ? this.addressEntryForm.value.addressTag.addressTagName : this.addressEntryForm.value.addressTag.name
    let cityName = this.addressEntryForm.value.city.cityName ? this.addressEntryForm.value.city.cityName : this.addressEntryForm.value.city.districtname;
    let cityId = this.addressEntryForm.value.city.cityId ? this.addressEntryForm.value.city.cityId : this.addressEntryForm.value.city._id;
    let stateId = this.addressEntryForm.value.state.stateId ? this.addressEntryForm.value.state.stateId : this.addressEntryForm.value.state._id;
    let stateName = this.addressEntryForm.value.state.stateName ? this.addressEntryForm.value.state.stateName : this.addressEntryForm.value.state.statename;

    postParam.countryId = '5bd0597eb339b81c30d3e7f2';
    postParam.countryName = 'India';
    postParam.stateId = stateId;
    postParam.stateName = stateName;
    postParam.cityId = cityId;
    postParam.cityName = cityName;
    postParam.addressTagId = this.addressEntryForm.value.addressTag.addressTagId;
    postParam.addressTagName = tagname;
    postParam.userId = this.userDetails.userId;
    postParam.name = this.addressEntryForm.value.name;
    postParam.mobile = this.addressEntryForm.value.mobile;
    postParam.addressLine1 = this.addressEntryForm.value.addresslines;
    postParam.pincode = this.addressEntryForm.value.pincode;
    let tagFlag = [];
    tagFlag =   this.tagName.filter(e => e == tagname && (tagname == 'Home' || tagname == 'Office'));
    if(!Updateflag && tagFlag.length > 0 ){
      this.toast.warning(tagname + ' address already exists.');
      return;
    }
    if (Updateflag && this.originAddessTag != tagname && tagFlag.length > 0) {
      this.toast.warning(tagname + ' address already exists.');
      return;
    }
    this.cartService.addOrEditAddress(postParam).subscribe((data: any) => {
      if (data.success) {
        this.toast.success(data.message);
        this.getAddress();
        this.dialog.closeAll();
      } else {
        this.toast.error(data.message);
      }
    });
  }

  addAddress(templateRef: TemplateRef<any>, isUpdate, indexObj?: any) {
    this.isEdit = isUpdate;
    if (!this.isEdit && this.tagName.length >= 5) {
      this.toast.warning("You can add only up to 5 billing addresses.");
      return;
    }
    this.SelectedIndex = indexObj;
    this.addressEntryForm.reset();
    if (isUpdate) {
      let param = {
        countryId: '5bd0597eb339b81c30d3e7f2',
        stateId: indexObj.state.stateId
      }
      this.cartService.getDistrictDetails(param).subscribe((data: any) => {
        this.districtList = data.data
        this.addressFormInitialize();
      })
    }
    isUpdate ? this.addressItemData = JSON.parse(JSON.stringify(indexObj)) : this.addressItemData = {};
    this.dialog.open(templateRef, {
      width: '65%',
      height: '65%',
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'addNewAddressContainer'
    }).afterClosed().subscribe((res) => {
      this.districtList = [];
    });
    this.addressFormInitialize();
  }

  removeAddress(templateRef: TemplateRef<any>, indexObj) {
    this.SelectedIndex = indexObj
    this.dialog.open(templateRef, {
      width: '35%',
      height: 'auto',
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'removeAddressContainer'
    });
  }

  removeAddressAction() {
    let removeParams = {
      userId: this.userDetails.userId,
      addressId: this.SelectedIndex.addressId
    }
    this.cartService.removeAddress(removeParams).subscribe((data: any) => {
      if (data.success) {
        this.toast.success(data.message);
        this.getAddress();
        this.dialog.closeAll();
      } else {
        this.toast.error(data.message);
      }
    });
  }

  getCurrentAddress(selection, index) {
    this.SelectedIndex = selection;
    this.radioChecked = index;
    this.util.addressSubject.next(this.SelectedIndex);
  }
  get name() {
    return this.addressEntryForm.get('name');
  }
  get mobile() {
    return this.addressEntryForm.get('mobile');
  }
  get addresslines() {
    return this.addressEntryForm.get('addresslines');
  }
  get city() {
    return this.addressEntryForm.get('city');
  }
  get state() {
    return this.addressEntryForm.get('state');
  }
  get addressTag() {
    return this.addressEntryForm.get('addressTag');
  }
  get pincode() {
    return this.addressEntryForm.get('pincode');
  }

  stateCompare(c1: { statename: string }, c2: { stateName: string }) {
    return c1 && c2 && c1.statename === c2.stateName;
  }
  cityCompare(c1: { districtname: string }, c2: { cityName: string }) {
    return c1 && c2 && c1.districtname === c2.cityName;
  }
  tagCompare(c1: { name: string }, c2: { addressTagName: string }) {
    return c1 && c2 && c1.name === c2.addressTagName;
  }

  //Checkout Functionalities
  continueClick(stepper:any) {
    stepper.next();
    this.currentTab = 1
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
        if(this.totalCartPrice!==0){
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
