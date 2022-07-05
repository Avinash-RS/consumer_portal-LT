import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { CartService } from "src/app/services/cart.service";
import { CatalogService } from "src/app/services/catalog.service";
import { UtilityService } from "src/app/services/utility.service";
import { AppConfigService } from "src/app/utils/app-config.service";
import { GlobalValidatorsService } from "src/app/validators/global-validators.service";
import { GlobalValidatorService } from 'src/app/services/global-validator.service';
import { GoogleAnalyticsService } from "src/app/services/google-analytics.service";
@Component({
  selector: "app-Address",
  templateUrl: "./Address.component.html",
  styleUrls: ["./Address.component.scss"]
})

export class AddressComponent implements OnInit {
  userDetails: any;
  addressList: any;
  isEdit: any;
  SelectedIndex: any;
  radioChecked: number = 0;
  addressItemData: any = {};
  addressEntryForm: FormGroup
  districtList: any = [];
  stateList: any = [];
  myControl = new FormControl();
  tagList: any = [];

  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private gv: GlobalValidatorsService,
    private cartService: CartService,
     private util: UtilityService,public toast: ToastrService,
    private appconfig: AppConfigService, private appConfig: AppConfigService,
    private glovbal_validators: GlobalValidatorService,
  ) {

  }

  ngOnInit() {
    this.userDetails = JSON.parse(this.appconfig.getLocalStorage('userDetails'));
    // console.log(this.userDetails.userId)
    this.addressFormInitialize();
    this.getAddress();
    this.getState()
    this.getaddressTags()
  }

  addressFormInitialize() {
    if (this.isEdit) {
      this.addressEntryForm = this.fb.group({
        name: [this.addressItemData?.name, [Validators.required , this.glovbal_validators.noWhitespaceValidator]],
        mobile: [this.addressItemData?.mobile, [Validators.required, this.glovbal_validators.mobileRegex()]],
        addresslines: [this.addressItemData?.addressLine1, [Validators.required  ,this.glovbal_validators.address255()]],
        city: [this.addressItemData?.city, [Validators.required]],
        state: [this.addressItemData?.state, [Validators.required]],
        pincode: [this.addressItemData?.pincode, [Validators.required,this.glovbal_validators.zipOnly()]],
        addressTag: [this.addressItemData?.addressTag, [Validators.required]],
      });
      console.log(this.addressEntryForm)
    } else {
      this.addressEntryForm = this.fb.group({
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
      console.log(data)
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
    console.log(data)
    let param = {
      countryId: data.country,
      stateId: data._id
    }
    this.getDistrict(param);
    this.addressEntryForm.get('city').setValue(null)
  }



  addOrUpdateAddress(Updateflag: boolean) {
    // let addParams: any = {
    //   isUpdate:Updateflag,
    //   name:"Kelvin",
    //   mobile:"9025993339",
    //   userId:this.userDetails.userId,
    //   addressLine1:"2, pallavaram",
    //   addressLine2:"pallavaram",
    //   stateId:"01",
    //   stateName:"Tamilnadu",
    //   cityId:"01",
    //   cityName:"Chennai",
    //   pincode:"600064",
    //   addressTagId:"ak6yce",
    //   addressTagName:"Others"
    // }
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

    console.log(this.SelectedIndex)
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
    console.log(selection,"-->DATA SENT TO CHECKOUT COMPONENT")
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
}
