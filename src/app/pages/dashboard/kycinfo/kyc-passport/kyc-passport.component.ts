import { Component, OnDestroy, OnInit ,AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/services/utility.service';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalValidatorService } from 'src/app/services/global-validator.service';
import { RemoveWhitespace } from 'src/app/services/removewhitespace'; 
import Swal from 'sweetalert2';
@Component({
  selector: 'app-kyc-passport',
  templateUrl: './kyc-passport.component.html',
  styleUrls: ['./kyc-passport.component.scss']
})

export class KycPassportComponent implements OnInit, AfterViewInit,OnDestroy {
  checkFormValidRequest: Subscription;
  personalForm: FormGroup;
  held =[
    {label:'Yes',value:true},
    {label:'No', value:false},
  ]

  // Form control name declaration Start


  form_heldPassport = 'heldPassport';
  form_passportNo = 'passportNo';
  form_passportDateOfIssue = 'passportDateOfIssue';
  form_passportExpireDate = 'passportExpireDate';
  form_pan = 'panNo';
  form_aadhar = 'aadhaarNo';
  form_drLicenseNo = 'drLicenseNo';
  form_drLicenseValidUpto = 'drLicenseValidUpto'

// Form control name declaration end

  passportDetails: any;
  getAllStates: any;
  nonMergedPersonalDetails: any;
  userDetails:any;

  constructor(
    private fb: FormBuilder,
    private utilService:UtilityService,
    public commonService: CommonService,
    public toast: ToastrService,
    private glovbal_validators: GlobalValidatorService
  ) {

  }

  ngOnInit() {
    this.userDetails =  JSON.parse(sessionStorage.getItem('userDetails'));
    this.formInitialize();
    this.getPassportData();
  }
  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  getPassportData() {
    var userID = this.userDetails.userId ? this.userDetails.userId : "";
      this.passportDetails = null;
      this.commonService.getKycUserDetails(userID).subscribe((result:any)=>{
        if(result.success){
          this.passportDetails = result.data.IdentityDetails;
          if(this.passportDetails){
            this.patchPersonalForm();
          }
          else{
            this.passportDetails = null;
          }
        }
        else{
          this.passportDetails = null;
        }
      });
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

  formSubmit(routeValue?:any) {
    var email =this.userDetails.email ? this.userDetails.email :null
    if (this.personalForm.valid) {
      let rawPersonalFormValue = this.personalForm.getRawValue();
      const apiData = {
        type : "IdentityDetails",
        emailId : email,
        IdentityDetails : {​​​​​​​​
          [this.form_heldPassport]: rawPersonalFormValue[this.form_heldPassport],
          [this.form_passportNo]: rawPersonalFormValue[this.form_passportNo],
          [this.form_passportDateOfIssue]:this.momentForm(rawPersonalFormValue[this.form_passportDateOfIssue]),
          [this.form_passportExpireDate]: this.momentForm(rawPersonalFormValue[this.form_passportExpireDate]),
          [this.form_pan]: rawPersonalFormValue[this.form_pan],
          [this.form_aadhar]: rawPersonalFormValue[this.form_aadhar],
          [this.form_drLicenseNo]: rawPersonalFormValue[this.form_drLicenseNo],
          [this.form_drLicenseValidUpto]: this.momentForm(rawPersonalFormValue[this.form_drLicenseValidUpto]),
         }​​​​​​​​,
      };
      this.savePassportDetails(apiData);
    } else {
      //this.ngAfterViewInit();
      this.toast.warning("Invalid User details");
    }
  }

  savePassportDetails(apiData){
    this.commonService.postKycUserDetails(apiData).subscribe((result:any)=>{
      if(result.success){
        this.toast.success(result.message);
        this.utilService.kyctabSubject.next('Education');
      }
      else{
        this.toast.warning(result.message);
      }
    });
  }

  patchPersonalForm() {
    this.personalForm.patchValue({
          [this.form_heldPassport]: this.passportDetails.heldPassport?this.passportDetails.heldPassport:false,
          [this.form_passportNo]: this.passportDetails.passportNo?this.passportDetails.passportNo:null,
          [this.form_passportDateOfIssue]: this.passportDetails.passportDateOfIssue?this.dateConvertion(this.passportDetails.passportDateOfIssue):null,
          [this.form_passportExpireDate]: this.passportDetails.passportExpireDate?this.dateConvertion(this.passportDetails.passportExpireDate):null,
          [this.form_pan]: this.passportDetails.panNo?this.passportDetails.panNo:null,
          [this.form_aadhar]: this.passportDetails.aadhaarNo ? this.passportDetails.aadhaarNo:null,
          [this.form_drLicenseNo]: this.passportDetails.drLicenseNo ? this.passportDetails.drLicenseNo:null,
          [this.form_drLicenseValidUpto]: this.passportDetails.drLicenseValidUpto?this.dateConvertion(this.passportDetails.drLicenseValidUpto):null,
    });
    this.disablePassportFields();
  }
 

  formInitialize() {
    this.personalForm = this.fb.group({
          [this.form_heldPassport]: [null,],
          [this.form_passportNo]:[null,[RemoveWhitespace.whitespace(),this.glovbal_validators.passport()]],
          [this.form_passportDateOfIssue]:[null],
          [this.form_passportExpireDate]: [null],
          [this.form_pan]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.panNo()]],
          [this.form_aadhar]: [{value: null, disabled: false}, [RemoveWhitespace.whitespace(), this.glovbal_validators.aadhaar()]],
          [this.form_drLicenseNo]: [null, [RemoveWhitespace.whitespace()]],
          [this.form_drLicenseValidUpto]: [null],  
    })
  }

  // Form getters
  get heldpass() {
    return this.personalForm.get(this.form_heldPassport);
  }
  get passportNo() {
    return this.personalForm.get(this.form_passportNo);
  }
  get doi() {
    return this.personalForm.get(this.form_passportDateOfIssue);
  }
  get doe() {
    return this.personalForm.get(this.form_passportExpireDate);
  }
  get pan() {
    return this.personalForm.get(this.form_pan);
  }
  get aadhar() {
    return this.personalForm.get(this.form_aadhar);
  }
  get lno() {
    return this.personalForm.get(this.form_drLicenseNo);
  }
  get valupto() {
    return this.personalForm.get(this.form_drLicenseValidUpto);
  }

  navigatePrevNext(type){
    if(this.personalForm.dirty){
      Swal.fire({
        customClass: {
          container: 'swalClass',
        },
        title: 'Are you sure you want to continue?',
        //text:'Are you sure you want to continue?',
        showCancelButton: true,
        confirmButtonColor: '#ffffff',
        cancelButtonColor: '#ffffff',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if(result.isConfirmed){
          this.utilService.kyctabSubject.next(type);
        }
      });
    }
    else{
      this.utilService.kyctabSubject.next(type);
    }
  }
  disablePassportFields(){
    if(!this.personalForm.value[this.form_heldPassport]){
      this.personalForm.patchValue({
        [this.form_passportNo]: null,
        [this.form_passportDateOfIssue]: null,
        [this.form_passportExpireDate] : null
      });
      this.personalForm.controls[this.form_passportNo].disable();
      this.personalForm.controls[this.form_passportDateOfIssue].disable();
      this.personalForm.controls[this.form_passportExpireDate].disable();
      this.personalForm.controls[this.form_passportNo].setValidators(null);
      this.personalForm.controls[this.form_passportNo].updateValueAndValidity();
      this.personalForm.controls[this.form_passportDateOfIssue].setValidators(null);
      this.personalForm.controls[this.form_passportDateOfIssue].updateValueAndValidity();
      this.personalForm.controls[this.form_passportExpireDate].setValidators(null);
      this.personalForm.controls[this.form_passportExpireDate].updateValueAndValidity();
    }
    else{
      this.personalForm.controls[this.form_passportNo].enable();
      this.personalForm.controls[this.form_passportDateOfIssue].enable();
      this.personalForm.controls[this.form_passportExpireDate].enable();
      this.personalForm.controls[this.form_passportNo].setValidators([RemoveWhitespace.whitespace(),Validators.required,this.glovbal_validators.passport()]);
      this.personalForm.controls[this.form_passportNo].updateValueAndValidity();
      this.personalForm.controls[this.form_passportDateOfIssue].setValidators([Validators.required]);
      this.personalForm.controls[this.form_passportDateOfIssue].updateValueAndValidity();
      this.personalForm.controls[this.form_passportExpireDate].setValidators([Validators.required]);
      this.personalForm.controls[this.form_passportExpireDate].updateValueAndValidity();
    }
  }
ngOnDestroy() {

  this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
}
}
