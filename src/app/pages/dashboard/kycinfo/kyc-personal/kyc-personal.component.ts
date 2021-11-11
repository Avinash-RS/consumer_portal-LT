import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { UtilityService } from 'src/app/services/utility.service';
import { AppConfigService } from 'src/app/utils/app-config.service';
import { GlobalValidatorService } from 'src/app/services/global-validator.service';
import { RemoveWhitespace } from 'src/app/services/removewhitespace';
import { CartService } from 'src/app/services/cart.service';


export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    // dateInput: 'DD MMM YYYY', // output ->  01 May 1995
    dateInput: 'DD-MM-YYYY', // output ->  01-10-1995
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-kyc-personal',
  templateUrl: './kyc-personal.component.html',
  styleUrls: ['./kyc-personal.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class KycPersonalComponent implements OnInit,AfterViewInit, OnDestroy {
  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;

  foriegn = ['Yes','No']
  marital_list = [
    {
      name: 'Married',
      value: 'Married'
    },
    {
      name: 'Unmarried',
      value: 'Unmarried'
    },
    {
      name: 'Widow',
      value: 'Widow'
    }
  ];
  no_children_list = [0, 1, 2, 3, 4, 5];
  category = [
    {
      name: 'Scheduled Caste',
      caste: 'SC'
    },
    {
      name: 'Scheduled Tribe',
      caste: 'ST'
    },
    {
      name: 'De-notified Tribe',
      caste: 'DenotifiedTribe'
    },
    {
      name: 'Nomadic Tribe',
      caste: 'NomadicTribe'
    },
    {
      name: 'Special Backward Category',
      caste: 'SBC'
    },
    {
      name: 'Other Backward Classes',
      caste: 'OBC'
    },
    {
      name: 'General / Open Category',
      caste: 'GEN'
    },
    {
      name: 'Other',
      caste: 'Other'
    },
  ];
  minDate: Date;
  minDateDOB: Date;
  maxDate: Date;
  url: any;
  // url = 'assets/images/img_avatar2.jpg';
  selectedImage: any;
  showSizeError = {
    image: false,
    size: false,
    minsize: false,
    maxsize: false,
    reset() {
      this.image = false
      this.minsize = false
      this.maxsize = false
    }
  };
  personalForm: FormGroup;
  // Title Dropdown list
  bloodGroupDropdownList: any;

  // Gender DropDown List
  genderDropdownList = [
    {
      label: 'Male',
      value: 'Male'
    },
    {
      label: 'Female',
      value: 'Female'
    }
  ]
  // Form control name declaration Start
  form_candidate_id = 'candidate_id';
  form_title = 'title';
  form_name = 'firstName';
  form_dob = 'dob';
  form_gender = 'gender';
  form_place_of_birth = 'placeOfBirth';
  form_state_of_birth = 'stateOfBirth';
  form_nationality = 'nationality';
  form_mother_tongue = 'motherTongue';
  form_religion = 'religion';
  form_caste = 'casteName';
  form_category = 'casteCategory';
  form_blood_group = 'bloodGroup';
  form_father_name = 'fatherName';
  form_emergency_contact = 'emergencyContactNo';
  form_mobile = 'phone';
  form_email = 'emailId';
  form_aadhar = 'aadharNo';
  form_pan = 'panNo';
  form_offer_reference = 'offerReference';
  form_offer_date = 'offerDate';
  form_height = 'heightInCm';
  form_weight = 'weightInKgs';
  form_identification_mark1 = 'identification_mark1';
  form_identification_mark2 = 'identification_mark2';

  form_emergency_contact_name = 'emergencyContactPersonName';
  form_emergency_contact_relation = 'relationwithEmergencyContact';
  form_personal_email = 'alternateEmailID';

  form_marital_status = 'maritalStatus';
  form_domicile_state = 'domicileState';
  form_no_of_children = 'noOfChildren';
  form_forigen_passport ='forigen_passport';
  form_mother_name ='form_mother_name';
  nationality_name;
  domicileState_name;
  stateOfBirth_name;
  profilePictureFormControl = new FormControl(null, [Validators.required]);
// Form control name declaration end

  personalDetails: any;
  getAllStates: any = [];
  nonMergedPersonalDetails: any;
  userDetails:any;
  country = [];


  constructor(
    private appConfig: AppConfigService,
    private fb: FormBuilder,
    private utilService:UtilityService,
    public commonService: CommonService,
    public toast: ToastrService,
    private glovbal_validators: GlobalValidatorService,
    private cart :CartService
  ) {
    this.dateValidation();
  }

  ngOnInit() {
    this.userDetails =  JSON.parse(sessionStorage.getItem('userDetails'));
    this.formInitialize();
    this.getCountry();
    //this.getStateAPI('5bd0597eb339b81c30d3e7f2');
    this.getPersonalData();
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  getPersonalData() {
    var userID = this.userDetails.userId ? this.userDetails.userId : "";
    this.personalDetails = null;
    this.commonService.getKycUserDetails(userID).subscribe((result:any)=>{
      if(result.success){
        this.personalDetails = result.data.personalDetails;
        this.personalDetails.email = result.data.email;
        if(this.personalDetails){
          this.getStateAPI(this.personalDetails.nationality ? this.personalDetails.nationality : '5bd0597eb339b81c30d3e7f2');
          this.patchPersonalForm();
        }
        else{
          this.personalDetails = null;
        }
      }
      else{
        this.personalDetails = null;
      }
    });
  }
  changeCountry(e){
    this.getStateAPI(e.value);
  }
  getCountry(){
    this.cart.getCountryDetails().subscribe((result:any)=>{
      if(result.success){
        this.country = result.data;
      }
     });
  }

  getStateAPI(countryCode) {
    let param = {
      countryId: countryCode
    }
   this.cart.getStateDetails(param).subscribe((result:any)=>{
     if(result.success){
      this.getAllStates = result.data;
     }
    
  })
  }

  getBloodGroup() {
      this.bloodGroupDropdownList = [
        {label:"o+ve",value:"o-ve"}
      ];
  }

  dateValidation() {
        // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
        const currentYear = new Date().getFullYear();
        this.minDate = new Date(currentYear - 50, 0, 1);
        this.minDateDOB = new Date(currentYear - 90, 0, 1);
        this.maxDate = new Date(currentYear + 20, 11, 31);
  }

  momentForm(date) {
    if (date) {
      const split = moment(date).format('YYYY-MM-DD');
     return split;
    }
  }

  dateConvertion(date) {
    if (date) {
      const split = moment(date).format();
      if (split == 'Invalid date') {
        const ddFormat = moment(date, 'YYYY-MM-DD').format();
        return ddFormat == 'Invalid date' ? null : ddFormat;
      }
     return split == 'Invalid date' ? null : split;
    }
  }
getState_nationalName(){
  let rawPersonalFormValue = this.personalForm.getRawValue();

  //get national name
  if(rawPersonalFormValue[this.form_nationality]){
    if(this.country.length > 0){
      this.country.forEach((element:any)=>{
        if(element._id == rawPersonalFormValue[this.form_nationality]){
          this.nationality_name  = element.countryname;
        }
      });
    }
  }
    //get state of birth
    if(rawPersonalFormValue[this.form_state_of_birth]){
      if(this.getAllStates.length > 0){
        this.getAllStates.forEach((element:any) => {
          if(element._id == rawPersonalFormValue[this.form_state_of_birth]){
            this.stateOfBirth_name = element.statename;
          }
        });
      }
    }
  //get dom state name
  if(rawPersonalFormValue[this.form_domicile_state]){
    if(this.getAllStates.length > 0){
      this.getAllStates.forEach((element:any) => {
        if(element._id == rawPersonalFormValue[this.form_domicile_state]){
          this.domicileState_name = element.statename;
        }
      });
    }
  }

}
  formSubmit() {
    if (this.personalForm.valid) {
      let rawPersonalFormValue = this.personalForm.getRawValue();
      this.getState_nationalName();
   
      const apiData = {
       type : "personalDetails",
       emailId: this.userDetails.email ? this.userDetails.email :null ,
       [this.form_place_of_birth]: rawPersonalFormValue[this.form_place_of_birth],
       [this.form_state_of_birth]: rawPersonalFormValue[this.form_state_of_birth],
       [this.form_nationality]: rawPersonalFormValue[this.form_nationality],
       [this.form_domicile_state]: rawPersonalFormValue[this.form_domicile_state],
       nationality_name : this.nationality_name ? this.nationality_name :null,
       stateOfBirth_name : this.stateOfBirth_name ? this.stateOfBirth_name:null,
       domicileState_name : this.domicileState_name ? this.domicileState_name:null,
      //  [this.form_name]: rawPersonalFormValue[this.form_name],
      //  lastName : "",
      //  [this.form_mobile]: rawPersonalFormValue[this.form_mobile],
      //  [this.form_dob]: this.momentForm(rawPersonalFormValue[this.form_dob]),      
      //  [this.form_gender]: rawPersonalFormValue[this.form_gender],
      // profileImage: this.url ? this.url : "",
      //  [this.form_marital_status]: rawPersonalFormValue[this.form_marital_status],
      //  [this.form_no_of_children]: rawPersonalFormValue[this.form_no_of_children],      
      //  [this.form_mother_tongue]: rawPersonalFormValue[this.form_mother_tongue],
      //  [this.form_religion]: rawPersonalFormValue[this.form_religion],
      //  [this.form_blood_group]: rawPersonalFormValue[this.form_blood_group],
      //  [this.form_category]: rawPersonalFormValue[this.form_category],
      //  [this.form_caste]: rawPersonalFormValue[this.form_caste],
      //  [this.form_father_name]: rawPersonalFormValue[this.form_father_name],
      //  [this.form_emergency_contact]: rawPersonalFormValue[this.form_emergency_contact],
      //  [this.form_emergency_contact_name]: rawPersonalFormValue[this.form_emergency_contact_name],
      //  [this.form_emergency_contact_relation]: rawPersonalFormValue[this.form_emergency_contact_relation],
      //  [this.form_aadhar]: rawPersonalFormValue[this.form_aadhar],
      //  [this.form_pan]: rawPersonalFormValue[this.form_pan],
      //  [this.form_offer_reference]: rawPersonalFormValue[this.form_offer_reference],
      //  [this.form_offer_date]: this.dateConvertion(rawPersonalFormValue[this.form_offer_date]),
      //  [this.form_height]: rawPersonalFormValue[this.form_height],
      //  [this.form_weight]: rawPersonalFormValue[this.form_weight],
      //  [this.form_personal_email]: rawPersonalFormValue[this.form_personal_email],
      //  identificationMark : [ 
      //    rawPersonalFormValue[this.form_identification_mark1],
      //    rawPersonalFormValue[this.form_identification_mark2]
      //  ],
       loginTime : moment().format('YYYY-MM-DD')
      };
      this.savePersonalDetails(apiData);
    } else {
      this.toast.warning("Invalid User Details");
      this.ngAfterViewInit();
    }
  }

savePersonalDetails(apiData){
  this.commonService.postKycUserDetails(apiData).subscribe((result:any)=>{
    if(result.success){
      this.toast.success(result.message);
      this.navigatePrevNext('Contact')
    }
    else{
      this.toast.warning(result.message);
    }
  });
}
  // async onSelectFile(event) {

  //   if (event.target.files && (event.target.files[0].type.includes('image/png') || event.target.files[0].type.includes('image/jp')) && !event.target.files[0].type.includes('svg')) {
  //     this.showSizeError.reset();

  //     // if (event.target.files[0].size > 500000 && event.target.files[0].size < 2000000) {
  //     if (event.target.files[0].size > 40000) {
  //       this.showSizeError.reset();
  //       if (event.target.files[0].size < 2000000) {
  //         this.showSizeError.reset();
  //         // this.showSizeError.image = false;
  //       this.selectedImage = event.target.files[0];

  //       const fd = new FormData();
  //       fd.append('product_image', this.selectedImage);
  //       const file = event.target.files[0].lastModified.toString() + event.target.files[0].name;
  //       const reader = new FileReader();
  //       let urls;

  //       reader.readAsDataURL(event.target.files[0]); // read file as data url
  //       reader.onload = async(event: any) => { // called once readAsDataURL is completed
  //         urls = event.target.result;
  //         this.url = urls;

  //         // this.appConfig.showLoader();
  //         // const data = await (await this.candidateService.profileUpload(fd)).json();
  //           // this.profileData = {
  //           //   fid: data[0].id,
  //           //   uuid: '',
  //           //   localShowUrl: data[0].frontend_url,
  //           //   apiUrl: data[0].backend_url
  //           // };
  //           // this.appConfig.setLocalData('profileData', JSON.stringify(this.profileData));
  //           //         this.appConfig.hideLoader();

  //       };
  //     } else {
  //       this.showSizeError.reset();
  //       this.showSizeError.maxsize = true;
  //     }
  //     } else {
  //       this.showSizeError.reset();
  //       this.showSizeError.minsize = true;
  //     }
  //   } else {
  //     this.showSizeError.reset();
  //     this.showSizeError.image = true;
  //   }
  // }
  onSelectFile(event) {
    const fd = new FormData();
    this.profilePictureFormControl.markAsTouched();
    if (event.target.files && (event.target.files[0].type.includes('image/png') || event.target.files[0].type.includes('image/jp')) && !event.target.files[0].type.includes('svg')) {
      if (event.target.files[0].size < 2000000) {
        let image = event.target.files[0];
        const formData = new FormData();
        formData.append('image', image);
        this.commonService.getprofileImgUpdate(formData).subscribe((data: any) => {
          if (data.data.path) {
            this.url = data.data.url;
            this.toast.success(data.message);
          }
          else {
            this.toast.warning('Something went wrong');
          }
        });
      } else {
        this.toast.warning('Maximum file size is 2 MB');
      }
    } else {
      return this.toast.warning('Please upload PNG/JPEG files only');
    }
  }
  public delete() {
    this.showSizeError.reset();
    this.url = null;
  }


  patchPersonalForm() {
    this.personalForm.patchValue({
      // [this.form_title]: this.personalDetails[this.form_title],
      [this.form_nationality]: this.personalDetails.nationality ? this.personalDetails.nationality :null,
      [this.form_place_of_birth]: this.personalDetails.placeOfBirth?  this.personalDetails.placeOfBirth :null,
      [this.form_state_of_birth]: this.personalDetails.stateOfBirth ?  this.personalDetails.stateOfBirth :null,
      [this.form_domicile_state]: this.personalDetails.domicileState ?  this.personalDetails.domicileState:null,

      // [this.form_name]: this.personalDetails.firstname ? this.personalDetails.firstname : null,
      // [this.form_dob]: this.personalDetails.dateOfBirth ? this.dateConvertion(this.personalDetails.dateOfBirth) : null,
      // [this.form_gender]: this.personalDetails.gender ? this.personalDetails.gender : null ,
      
      
      
      // [this.form_religion]: this.personalDetails.religion ? this.personalDetails.religion :null,
      // [this.form_caste]: this.personalDetails.casteName ? this.personalDetails.casteName :null,
      // [this.form_category]: this.personalDetails.casteCategory ? this.personalDetails.casteCategory :null,
      // [this.form_blood_group]: this.personalDetails.bloodGroup ? this.personalDetails.bloodGroup:null,
      // [this.form_father_name]: this.personalDetails.fatherName ? this.personalDetails.fatherName:null,
      // [this.form_emergency_contact]: this.personalDetails.emergencyContactNo ?  this.personalDetails.emergencyContactNo:null,
      // [this.form_mobile]: this.personalDetails.phone ? this.personalDetails.phone :null,
      // [this.form_email]: this.personalDetails.email ? this.personalDetails.email:null,
      // [this.form_aadhar]: this.personalDetails.aadharNo ? this.personalDetails.aadharNo:null,
      // [this.form_pan]: this.personalDetails.panNo ? this.personalDetails.panNo :null,
      // [this.form_offer_reference]: this.personalDetails.offerReference ? this.personalDetails.offerReference:null,
      // [this.form_offer_date]:this.personalDetails.offerDate? this.dateConvertion(this.personalDetails.offerDate):null,
      // [this.form_height]: this.personalDetails.heightInCm ? this.personalDetails.heightInCm :null,
      // [this.form_weight]: this.personalDetails.weightInKgs ? this.personalDetails.weightInKgs :null,
      // [this.form_identification_mark1]: this.personalDetails.identificationMark[0] ? this.personalDetails.identificationMark[0] :null,
      // [this.form_identification_mark2]: this.personalDetails.identificationMark[1] ? this.personalDetails.identificationMark[1] :null,
      // [this.form_emergency_contact_name]: this.personalDetails.emergencyContactPersonName ?this.personalDetails.emergencyContactPersonName:null,
      // [this.form_emergency_contact_relation]: this.personalDetails.relationwithEmergencyContact? this.personalDetails.relationwithEmergencyContact :null,
      // [this.form_personal_email]: this.personalDetails.alternateEmailID ? this.personalDetails.alternateEmailID :null,
      
      // [this.form_marital_status]: this.personalDetails.maritalStatus ? this.personalDetails.maritalStatus:null,
      // [this.form_no_of_children]: this.personalDetails.noOfChildren? this.personalDetails.noOfChildren:null
    });
    //this.url = this.personalDetails.profileImage ? this.personalDetails.profileImage:null;
    //this.checkIsMarried();
  }
  maritalStatusChange() {
    this.checkIsMarried();
  }
  checkIsMarried() {
    if (this.personalForm.value[this.form_marital_status] && this.personalForm.value[this.form_marital_status] == 'Married' || this.personalForm.value[this.form_marital_status] && this.personalForm.value[this.form_marital_status] == 'Widow') {
      this.personalForm.controls[this.form_no_of_children].setValidators([Validators.required]);
      this.personalForm['controls'][this.form_no_of_children].updateValueAndValidity({ emitEvent: false });
    } else {
      this.personalForm.controls[this.form_no_of_children].setValue(null);
      this.personalForm.controls[this.form_no_of_children].clearValidators();
      this.personalForm['controls'][this.form_no_of_children].updateValueAndValidity({ emitEvent: false });
    }
  }
  formInitialize() {
    var email =this.userDetails.email ? this.userDetails.email :null
    this.personalForm = this.fb.group({
      [this.form_place_of_birth]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_state_of_birth]: [null,],
      [this.form_nationality]: [{value: null, disabled: false}, [RemoveWhitespace.whitespace(),  this.glovbal_validators.alphaNum255()]],
      [this.form_domicile_state]: [null,],

      // [this.form_name]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      // [this.form_dob]: [null, [Validators.required]],
      // [this.form_gender]: [null, [Validators.required]],
      // [this.form_mother_tongue]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      // [this.form_religion]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      // [this.form_caste]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      // [this.form_category]: [null, [Validators.required]],
      // [this.form_blood_group]: [null, [Validators.required]],
      // [this.form_father_name]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      // [this.form_mother_name]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      // [this.form_forigen_passport]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      // [this.form_emergency_contact]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.mobileRegex()]],
      // [this.form_mobile]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.mobileRegex()]],
      // [this.form_email]: [{value: email, disabled: true}, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.email()]],
      // [this.form_aadhar]: [{value: null, disabled: false}, [RemoveWhitespace.whitespace(), Validators.required , this.glovbal_validators.aadhaar()]],
      // [this.form_pan]: [null, [RemoveWhitespace.whitespace(), Validators.required , this.glovbal_validators.panNo()]],
      // [this.form_offer_reference]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.offer()]],
      // [this.form_offer_date]: [null, [Validators.required]],
      // [this.form_height]: [{value: null, disabled: false}, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.numberDecimals()]],
      // [this.form_weight]: [{value: null, disabled: false}, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.numberDecimals()]],
      // [this.form_identification_mark1]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      // [this.form_identification_mark2]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      // [this.form_emergency_contact_name]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      // [this.form_emergency_contact_relation]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()]],
      // [this.form_personal_email]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.email()]],
      // [this.form_domicile_state]: [null, [Validators.required]],
      // [this.form_marital_status]: [null, [Validators.required]],
      // [this.form_no_of_children]: [null],
    })
  }
  get fname() {
    return this.personalForm.get(this.form_name);
  }
  get dob() {
    return this.personalForm.get(this.form_dob);
  }
  get gender() {
    return this.personalForm.get(this.form_gender);
  }
  get place_of_birth() {
    return this.personalForm.get(this.form_place_of_birth);
  }
  get state_of_birth() {
    return this.personalForm.get(this.form_state_of_birth);
  }
  get nationality() {
    return this.personalForm.get(this.form_nationality);
  }
  get mother_tongue() {
    return this.personalForm.get(this.form_mother_tongue);
  }
  get religion() {
    return this.personalForm.get(this.form_religion);
  }
  get caste() {
    return this.personalForm.get(this.form_caste);
  }
  get category1() {
    return this.personalForm.get(this.form_category);
  }
  get blood_group() {
    return this.personalForm.get(this.form_blood_group);
  }
  get father_name() {
    return this.personalForm.get(this.form_father_name);
  }
  get emergency_contact() {
    return this.personalForm.get(this.form_emergency_contact);
  }
  get mobile() {
    return this.personalForm.get(this.form_mobile);
  }
  get email() {
    return this.personalForm.get(this.form_email);
  }
  get aadhar() {
    return this.personalForm.get(this.form_aadhar);
  }
  get pan() {
    return this.personalForm.get(this.form_pan);
  }
  get offer_reference() {
    return this.personalForm.get(this.form_offer_reference);
  }
  get offer_date() {
    return this.personalForm.get(this.form_offer_date);
  }
  get height() {
    return this.personalForm.get(this.form_height);
  }
  get weight() {
    return this.personalForm.get(this.form_weight);
  }
  get identification_mark1() {
    return this.personalForm.get(this.form_identification_mark1);
  }
  get identification_mark2() {
    return this.personalForm.get(this.form_identification_mark2);
  }

  get emergency_contact_name() {
    return this.personalForm.get(this.form_emergency_contact_name);
  }

  get emergency_contact_relation() {
    return this.personalForm.get(this.form_emergency_contact_relation);
  }

  get personal_email() {
    return this.personalForm.get(this.form_personal_email);
  }

  get domicile_state() {
    return this.personalForm.get(this.form_domicile_state);
  }

  get marital_status() {
    return this.personalForm.get(this.form_marital_status);
  }

  get no_of_children() {
    return this.personalForm.get(this.form_no_of_children);
  }
  navigatePrevNext(type){
    this.utilService.kyctabSubject.next(type);
  }
ngOnDestroy() {
  this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
  this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
}
}
