import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/services/utility.service';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalValidatorService } from 'src/app/services/global-validator.service';
import { RemoveWhitespace } from 'src/app/services/removewhitespace';
import { CartService } from 'src/app/services/cart.service';
@Component({
  selector: 'app-kyc-contact',
  templateUrl: './kyc-contact.component.html',
  styleUrls: ['./kyc-contact.component.scss']
})


export class KycContactComponent implements OnInit,AfterViewInit, OnDestroy {

  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  contactForm: FormGroup;
  allStatesList: any = [
    {name:'Tamilnadu',id:'Tamilnadu'},
    {name:'Kerala',id:'Kerala'}
  ];
  allPresentCityList: any =[
    {name:'Chennai',id:'Chennai'},
    {name:'Coimbatore',id:'Coimbatore'}
  ];
  allPermanentCityList: any= [
    {name:'Chennai',id:'Chennai'},
    {name:'Coimbatore',id:'Coimbatore'}
  ];
  regionList = [

  ];
  //form Variables
  form_present_address_1 = 'address1';
  form_present_address_2 = 'address2';
  form_present_address_3 = 'address3';
  form_present_city = 'city';
  form_present_state = 'state';
  form_present_zip_code = 'zipCode';
  form_present_region = 'country';
  form_same_as_checkbox = 'isSamePermanent';
  form_permanent_address_1 = 'per_address1';
  form_permanent_address_2 = 'per_address2';
  form_permanent_address_3 = 'per_address3';
  form_permanent_city = 'per_city';
  form_permanent_state = 'per_state';
  form_permanent_zip_code = 'per_zipCode';
  form_permanent_region = 'per_country';
  form_mobile = 'phone';

  form_email = 'emailId';
  form_personal_email = 'alternateEmail';
  form_alternate_mobile = 'alternatePhone'
  contactDetails: any;
  userDetails:any;
  presentCountry;
  presentState;
  presentCity;
  permanentCountry;
  permanentState;
  permanentCity;
  permanentRegionValue ='5bd0597eb339b81c30d3e7f2';
  presentRegionValue ='5bd0597eb339b81c30d3e7f2';
  constructor(
    private fb: FormBuilder,
    private utilService:UtilityService,
    public commonService: CommonService,
    public toast: ToastrService,
    private glovbal_validators: GlobalValidatorService,
    private cart :CartService
  ) {
  }

  ngOnInit() {
    this.userDetails =  JSON.parse(sessionStorage.getItem('userDetails'));
    this.getCountry();
    this.formInitialize();

    this.getContactDetails();
    this.saveRequestRxJs();



  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }



  getAllPresentCities(id) {
    const ApiData = {
      state_id: id
    };
  }

  getAllPermanentCities(id) {
    const ApiData = {
      state_id: id
    };
  }

  getCountry(){
    this.cart.getCountryDetails().subscribe((result:any)=>{
      if(result.success){
        this.regionList = result.data;
      }
     });
  }

  getPermanentStateAPI(countryCode) {
    let param = {
      countryId: countryCode
    }
   this.cart.getStateDetails(param).subscribe((result:any)=>{
     if(result.success){
      this.permanentState = result.data;
     }

  })
  }
  getPresentStateAPI(countryCode) {
    let param = {
      countryId: countryCode
    }
   this.cart.getStateDetails(param).subscribe((result:any)=>{
     if(result.success){
      this.presentState = result.data;
     }

  })
  }
  getPermanentCity(countrycode,StateCode) {
    let param = {
      countryId: countrycode,
      stateId: StateCode
    }
   this.cart.getDistrictDetails(param).subscribe((result:any)=>{
     if(result.success){
      this.permanentCity = result.data;
     }

  })
  }
  getPresenttCity(countrycode,StateCode) {
    let param = {
      countryId: countrycode,
      stateId: StateCode
    }
   this.cart.getDistrictDetails(param).subscribe((result:any)=>{
     if(result.success){
      this.presentCity = result.data;
     }

  })
  }
  changePermanentRegion(value){
    if(this.regionList.length > 0){
      this.regionList.forEach((element:any)=>{
       if(element.countryname == value.value){
         this.permanentRegionValue = element._id;
         this.getPermanentStateAPI(element._id);
       }
     })
   }
  }
  changePresentRegion(value){
    if(this.regionList.length > 0){
      this.regionList.forEach((element:any)=>{
       if(element.countryname == value.value){
        this.presentRegionValue = element._id;
         this.getPresentStateAPI(element._id);
       }
     })
   }
  }
  chanegePeramanentState(statevalue){
    if(this.permanentState.length > 0){
      this.permanentState.forEach(element => {
        if(element.statename == statevalue.value){
          this.getPermanentCity(this.permanentRegionValue,element._id)
        }
      });
    }
  }

  chanegepresenetState(statevalue){
    if(this.presentState.length > 0){
      this.presentState.forEach(element => {
        if(element.statename == statevalue.value){
          this.getPresenttCity(this.presentRegionValue,element._id)
        }
      });
    }
  }
  matchangeYes(e) {
    if (e.checked) {
      this.updatePermanentAsPerPresent();
    } else {
      this.updatePermanentAsPerPresent();
    }
  }

  getContactDetails() {
    var userID = this.userDetails.userId ? this.userDetails.userId : "";
    this.contactDetails =null;
    this.commonService.getKycUserDetails(userID).subscribe((result:any)=>{
      if(result.success){
        this.contactDetails = result.data.contactDetails;
        var phone = result.data.profile.phone;
        this.contactForm.patchValue({
          [this.form_mobile]: phone ? phone:null,
        });
        if(this.contactDetails){
          this.patchContactForm();
        }
        else{
          this.contactDetails = null;
        }
      }
      else{
        this.contactDetails = null;
      }
    });
  }

  formSubmit(routeValue?: any) {
    if (this.contactForm['value'][this.form_same_as_checkbox]) {
      this.updatePermanentAsPerPresent();
    }
    if (this.contactForm.valid) {
      var email =this.userDetails.email ? this.userDetails.email :null
      let rawContactFormValue = this.contactForm.getRawValue();
        const apiData = {
          type : "contactDetails",
          emailId : email,
           contactDetails : {
            [this.form_alternate_mobile]: rawContactFormValue[this.form_alternate_mobile],
            [this.form_personal_email]: rawContactFormValue[this.form_personal_email],
            [this.form_same_as_checkbox]: rawContactFormValue[this.form_same_as_checkbox] ? rawContactFormValue[this.form_same_as_checkbox] : false,
            present : {
                [this.form_present_address_1]: rawContactFormValue[this.form_present_address_1],
                // [this.form_present_address_2]: rawContactFormValue[this.form_present_address_2],
                // [this.form_present_address_3]: rawContactFormValue[this.form_present_address_3],
                [this.form_present_state]: rawContactFormValue[this.form_present_state],
                [this.form_present_city]: rawContactFormValue[this.form_present_city],
                [this.form_present_zip_code]: rawContactFormValue[this.form_present_zip_code],
                [this.form_present_region]: rawContactFormValue[this.form_present_region],
            },
            permanent :  {
                [this.form_permanent_address_1]: rawContactFormValue[this.form_permanent_address_1],
                // [this.form_permanent_address_2]: rawContactFormValue[this.form_permanent_address_2],
                // [this.form_permanent_address_3]: rawContactFormValue[this.form_permanent_address_3],
                [this.form_permanent_state]: rawContactFormValue[this.form_permanent_state],
                [this.form_permanent_city]: rawContactFormValue[this.form_permanent_city],
                [this.form_permanent_zip_code]: rawContactFormValue[this.form_permanent_zip_code],
                [this.form_permanent_region]: rawContactFormValue[this.form_permanent_region],
            }
         }
        }
        this.saveContactDetails(apiData);
    } else {
      this.toast.warning("Invalid User Details");
    }

  }
  saveContactDetails(apiData){
    this.commonService.postKycUserDetails(apiData).subscribe((result:any)=>{
      if(result.success){
        this.toast.success(result.message);
        this.navigatePrevNext('Passport')
      }
      else{
        this.toast.warning(result.message);
      }
    });
  }
  saveRequestRxJs() {

  }





  patchContactForm() {
    this.changePermanentRegion({value:this.contactDetails.permanent.per_country});
    this.changePresentRegion({value:this.contactDetails.present.country});
    this.chanegepresenetState({value:this.contactDetails.present.state} );
    this.chanegePeramanentState({value:this.contactDetails.permanent.per_state});

    this.contactForm.patchValue({
      [this.form_alternate_mobile]:this.contactDetails.alternatePhone ? this.contactDetails.alternatePhone:null,
      [this.form_personal_email]: this.contactDetails.alternateEmail ? this.contactDetails.alternateEmail:null,
      [this.form_present_address_1]: this.contactDetails.present.address1 ? this.contactDetails.present.address1:null,
      // [this.form_present_address_2]: this.contactDetails.present.address2 ? this.contactDetails.present.address2:null,
      // [this.form_present_address_3]: this.contactDetails.present.address3 ? this.contactDetails.present.address3:null,
      [this.form_present_city]: this.contactDetails.present.city ?this.contactDetails.present.city:null,
      [this.form_present_state]: this.contactDetails.present.state ?this.contactDetails.present.state:null,
      [this.form_present_region]: this.contactDetails.present.country ?this.contactDetails.present.country:null,
      [this.form_present_zip_code]: this.contactDetails.present.zipCode ?this.contactDetails.present.zipCode:null,
      [this.form_same_as_checkbox]: this.contactDetails.isSamePermanent ?this.contactDetails.isSamePermanent:false,
      [this.form_permanent_address_1]: this.contactDetails.permanent.per_address1 ?this.contactDetails.permanent.per_address1:null,
      // [this.form_permanent_address_2]: this.contactDetails.permanent.per_address2 ?this.contactDetails.permanent.per_address2:null,
      // [this.form_permanent_address_3]: this.contactDetails.permanent.per_address3 ?this.contactDetails.permanent.per_address3:null,
      [this.form_permanent_city]: this.contactDetails.permanent.per_city ?this.contactDetails.permanent.per_city:null,
      [this.form_permanent_state]: this.contactDetails.permanent.per_state ?this.contactDetails.permanent.per_state:null,
      [this.form_permanent_region]:  this.contactDetails.permanent.per_country ?this.contactDetails.permanent.per_country :null,
      [this.form_permanent_zip_code]: this.contactDetails.permanent.per_zipCode ?this.contactDetails.permanent.per_zipCode:null,
    });
    this.disableOrEnableState(this.form_present_state);
    this.disableOrEnableState(this.form_permanent_state);
    this.patchApiCityId();
  }

  patchApiCityId() {
    this.contactForm.patchValue({
      [this.form_present_city]: this.contactDetails.present.city ?this.contactDetails.present.city:null,
      [this.form_permanent_city]: this.contactDetails.permanent.per_state ?this.contactDetails.permanent.per_city:null
    })
  }

  formInitialize() {
    var email =this.userDetails.email ? this.userDetails.email :null
    this.contactForm = this.fb.group({
      [this.form_mobile]: [{value: null, disabled: true}, [RemoveWhitespace.whitespace(), this.glovbal_validators.mobileRegex()]],
      [this.form_alternate_mobile]: [{value: null, disabled: false}, [RemoveWhitespace.whitespace(), this.glovbal_validators.mobileRegex()]],
      [this.form_email]: [{value: email, disabled: true}, [RemoveWhitespace.whitespace(), this.glovbal_validators.email()]],
      [this.form_personal_email]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.email()]],
      [this.form_present_address_1]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_personal_email]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.email()]],
      // [this.form_present_address_2]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      // [this.form_present_address_3]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_present_city]: [null,],
      [this.form_present_state]: [null,],
      [this.form_present_region]: [null,],
      [this.form_present_zip_code]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.zipOnly()]],
      [this.form_same_as_checkbox]: [null],
      [this.form_permanent_address_1]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      // [this.form_permanent_address_2]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      // [this.form_permanent_address_3]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_permanent_city]: [null,],
      [this.form_permanent_state]: [null,],
      [this.form_permanent_region]: [null,],
      [this.form_permanent_zip_code]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.zipOnly()]]
    })
  }

  // Form getters
  get present_address_1() {
    return this.contactForm.get(this.form_present_address_1);
  }
  get present_address_2() {
    return this.contactForm.get(this.form_present_address_2);
  }
  get present_address_3() {
    return this.contactForm.get(this.form_present_address_3);
  }
  get present_city() {
    return this.contactForm.get(this.form_present_city);
  }
  get present_state() {
    return this.contactForm.get(this.form_present_state);
  }
  get present_zip_code() {
    return this.contactForm.get(this.form_present_zip_code);
  }
  get present_region() {
    return this.contactForm.get(this.form_present_region);
  }
  get same_as_checkbox() {
    return this.contactForm.get(this.form_same_as_checkbox);
  }
  get permanent_address_1() {
    return this.contactForm.get(this.form_permanent_address_1);
  }
  get permanent_address_2() {
    return this.contactForm.get(this.form_permanent_address_2);
  }
  get permanent_address_3() {
    return this.contactForm.get(this.form_permanent_address_3);
  }
  get permanent_city() {
    return this.contactForm.get(this.form_permanent_city);
  }
  get permanent_state() {
    return this.contactForm.get(this.form_permanent_state);
  }
  get permanent_zip_code() {
    return this.contactForm.get(this.form_permanent_zip_code);
  }
  get permanent_region() {
    return this.contactForm.get(this.form_permanent_region);
  }
  get mobile() {
    return this.contactForm.get(this.form_mobile);
  }
  get email() {
    return this.contactForm.get(this.form_email);
  }
  get personal_email() {
    return this.contactForm.get(this.form_personal_email);
  }
  get alternate_mobile() {
    return this.contactForm.get(this.form_alternate_mobile);
  }
  updatePermanentAsPerPresent() {
    this.contactForm.patchValue({
      [this.form_permanent_address_1]: this.contactForm['value'][this.form_present_address_1] ? this.contactForm['value'][this.form_present_address_1] : null,
      [this.form_permanent_address_2]: this.contactForm['value'][this.form_present_address_2] ? this.contactForm['value'][this.form_present_address_2] : null,
      [this.form_permanent_address_3]: this.contactForm['value'][this.form_present_address_3] ? this.contactForm['value'][this.form_present_address_3] : null,
      [this.form_permanent_city]: this.contactForm['value'][this.form_present_city] ? this.contactForm['value'][this.form_present_city] : null,
      [this.form_permanent_state]: this.contactForm['value'][this.form_present_state] ? this.contactForm['value'][this.form_present_state] : null,
      [this.form_permanent_region]: this.contactForm['value'][this.form_present_region] ? this.contactForm['value'][this.form_present_region] : null,
      [this.form_permanent_zip_code]: this.contactForm['value'][this.form_present_zip_code] ? this.contactForm['value'][this.form_present_zip_code] : null
    }, { emitEvent: false });
  }

  releaseDisabledValue() {
    this.contactForm.controls[this.form_permanent_address_1].enable({ emitEvent: false });
    this.contactForm.controls[this.form_permanent_address_2].enable({ emitEvent: false });
    this.contactForm.controls[this.form_permanent_address_3].enable({ emitEvent: false });
    this.contactForm.controls[this.form_permanent_city].enable({ emitEvent: false });
    this.contactForm.controls[this.form_permanent_state].enable({ emitEvent: false });
    this.contactForm.controls[this.form_permanent_region].enable({ emitEvent: false });
    this.contactForm.controls[this.form_permanent_zip_code].enable({ emitEvent: false });
  }
  disablePresentCity() {
    this.contactForm.patchValue({
      [this.form_present_city]: null,
    }), { emitEvent: false };
    if (this.contactForm['value'][this.form_same_as_checkbox]) {
      this.contactForm.patchValue({
        [this.form_permanent_city]: null,
      }), { emitEvent: false };
      this.contactForm.controls[this.form_present_city].disable({ emitEvent: false });
      return this.contactForm.controls[this.form_permanent_city].disable({ emitEvent: false });
    }
    return this.contactForm.controls[this.form_present_city].disable({ emitEvent: false });
  }
  enablePresentCity(id) {
    this.contactForm.controls[this.form_present_city].enable({ emitEvent: false });
    if (this.contactForm['value'][this.form_same_as_checkbox]) {
      this.contactForm.controls[this.form_permanent_city].enable({ emitEvent: false });
      this.getAllPresentCities(id);
      return this.getAllPermanentCities(id);
    }
    return this.getAllPresentCities(id);
  }
  disablePermanentCity() {
    this.contactForm.patchValue({
      [this.form_permanent_city]: null,
    }), { emitEvent: false };
    return this.contactForm.controls[this.form_permanent_city].disable({ emitEvent: false });
  }
  enablePermanentCity(id) {
    this.contactForm.controls[this.form_permanent_city].enable({ emitEvent: false });
    return this.getAllPermanentCities(id);
  }

  disableOrEnableState(formField) {
    if (this.form_present_state == formField) {
      if (this.contactForm['value'][formField]) {
        this.contactForm.patchValue({
          [this.form_present_city]: null,
        }), { emitEvent: false };
            return this.enablePresentCity(this.contactForm['value'][formField]);
      }
      this.disablePresentCity();
    } else {
      if (this.contactForm['value'][formField]) {
        this.contactForm.patchValue({
          [this.form_permanent_city]: null,
        }), { emitEvent: false };
        return this.enablePermanentCity(this.contactForm['value'][formField]);
      }
      this.disablePermanentCity();
    }
  }

  // Value changes to check present and permanent are same
  valueChanges() {
    this.contactForm.valueChanges.subscribe((data: any) => {
      // Below is for automatic update of permanent address
      // if (data[this.form_same_as_checkbox]) {
      //   return this.updatePermanentAsPerPresent();
      // } else {
      //   return this.releaseDisabledValue();
      // }
    });
  }
  navigatePrevNext(type){
    this.utilService.kyctabSubject.next(type);
  }
  ngOnDestroy() {
    this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
    this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
  }
}

