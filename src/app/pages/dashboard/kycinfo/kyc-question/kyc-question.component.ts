import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AppConfigService } from 'src/app/utils/app-config.service';
import { UtilityService } from 'src/app/services/utility.service';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalValidatorService } from 'src/app/services/global-validator.service';
import { RemoveWhitespace } from 'src/app/services/removewhitespace';

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
  selector: 'app-kyc-question',
  templateUrl: './kyc-question.component.html',
  styleUrls: ['./kyc-question.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})


export class KycQuestionComponent implements OnInit,AfterViewInit, OnDestroy {

  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  workDetailsForm: FormGroup;
  minDate: Date;
  maxDate: Date;

  diffAbledDropdownList = [
    {
      label: 'Yes',
      value: '1'
    },
    {
      label: 'No',
      value: '0'
    }
  ];
  activeDropdownList = [
    {
      label: 'Active',
      value: '1'
    },
    {
      label: 'Inactive',
      value: '0'
    }
  ];
  //form Variables
  form_workDetails = "workDetails";
  form_total_exp_years = "totalYear";
  form_total_exp_months = "totalMonth";
  form_break_in_emp = "breakReason";
  form_employed_us = "employed_us";
  form_oc = "oc";
  form_payslip = "payslipNo";
  form_interviewed_by_us = "interviewed_by_us";
  form_post = "postAppliedFor";
  form_when_interview = "appliedDate"
  form_employment_name_address = "employerName";
  form_duration_from = "durationFrom";
  form_duration_to = "durationTo";
  form_duration_year = "year";
  form_duration_month = "month";
  form_postion_field = "positionHeld";
  form_name_designation_supervisor = "superiorNameWdDesignation";
  form_nature_work = "natureOfWorkDone";
  form_gross_emploment = "grossEmoluments";
  form_reason_leaving = "reasonForLeaving";
  form_hr_name = 'hrName';
  form_hr_contact_no = 'hrContactNumber';
  form_hr_email = 'hrEmailId';
  form_bgvDetails = "bgvDetails";
  form_convicted_by_Court = "convicted_by_Law";
  form_arrested = "arrested";
  form_prosecuted = "prosecuted";
  form_detention = "kept_under_detention";
  form_fined_by_court = "finedCourtOfLaw";
  form_debarred_exam_university = "debarredUniversity";
  form_debarred_psc_company = "debarredcompany";
  form_court_case_pending = "pendingCase";
  form_university_case_pending = "universityCasePending";
  form_disciplinary_proceedings = "disciplinaryProblem";
  form_full_particulars = "caseDescription"

  form_Employment_Array = "Employment"

  workDetails: any;

  isWorkExp = new FormControl(null);
  showWorkExp: any = '0';
  userDetails:any;
  constructor(
    private appConfig: AppConfigService,
    private utilService:UtilityService,
    private fb: FormBuilder,
    public commonService: CommonService,
    public toast: ToastrService,
    private glovbal_validators: GlobalValidatorService
  ) {
    this.dateValidation();
  }

  ngOnInit() {
    this.userDetails =  JSON.parse(localStorage.getItem('userDetails'));
    this.formInitialize();
    this.getWorkApiDetails();
  }
  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  changeWorkExp(e) {
    if (e.checked) {
      this.showWorkExp = '1';
    } else {
      this.showWorkExp = '0';
    }
  }



  getWorkApiDetails() {
    var userID = this.userDetails.userId ? this.userDetails.userId : "";
    this.workDetails = null;
    this.commonService.getKycUserDetails(userID).subscribe((result:any)=>{
      if(result.success){
        this.workDetails = result.data.experienceDetails;
        if(this.workDetails){
          this.patchWorkForm();
        }
        else{
          this.workDetails = null;
          this.getEmploymentArr.push(this.initEmploymentArray());
        }
      }
      else{
        this.workDetails = null;
        this.getEmploymentArr.push(this.initEmploymentArray());
      }
    });      
 

  }
  dateValidation() {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 50, 0, 1);
    this.maxDate = new Date(currentYear + 20, 11, 31);
  }

  momentForm(date) {
    if (date) {
      const split = moment(date).format('DD-MM-YYYY');
      return split;
    }
  }

  momentForm1(date) {
    if (date) {
      const split = moment(date).format();
      return split;
    }
  }


  dateConvertion(date) {
    if (date) {
      const split = moment(date).format();
      if (split == 'Invalid date') {
        const ddFormat = moment(date, 'DD-MM-YYYY').format();
        return ddFormat == 'Invalid date' ? null : ddFormat;
      }
      return split == 'Invalid date' ? null : split;
    }
  }


  patchWorkForm() {
    if (this.workDetails){
      this.workDetailsForm.patchValue({
        [this.form_oc]: this.workDetails.oc,
        [this.form_payslip]: this.workDetails.payslipNo,
        [this.form_post]:this.workDetails.postAppliedFor,
        [this.form_when_interview]:this.workDetails.appliedDate,
        [this.form_total_exp_years] : this.workDetails.totalYear,
        [this.form_total_exp_months] :  this.workDetails.totalMonth,
        [this.form_break_in_emp] : this.workDetails.breakReason,
        [this.form_employed_us] : (this.workDetails.oc || this.workDetails.payslipNo) ? '1' : '0',
        [this.form_interviewed_by_us] : (this.workDetails.postAppliedFor || this.workDetails.appliedDate) ? '1' : '0',
      });
    }
    if (this.workDetails && this.workDetails.disciplinaryDetails) {
      this.OtherConditionsPatch(this.workDetails.disciplinaryDetails);
    }
    if (this.workDetails &&  this.workDetails.employeementDetails && this.workDetails.employeementDetails.length > 0) {
      this.getEmploymentArr.clear();
      this.workDetails.employeementDetails.forEach((element, i) => {
        this.getEmploymentArr.push(this.EmploymentArrayPatch(element));
      });
      this.isWorkExp.setValue(true)
      this.showWorkExp = '1';
    } else {
      this.isWorkExp.setValue(false)
      this.getEmploymentArr.push(this.initEmploymentArray());
    }
  }

  OtherConditionsPatch(data) {
    this.workDetailsForm.patchValue({
      [this.form_convicted_by_Court]: data[this.form_convicted_by_Court] ? data[this.form_convicted_by_Court]:false,
      [this.form_arrested]: data[this.form_arrested] ? data[this.form_arrested]: false,
      [this.form_prosecuted]: data[this.form_prosecuted] ? data[this.form_prosecuted] : false,
      [this.form_detention]: data[this.form_detention] ? data[this.form_detention]: false,
      [this.form_fined_by_court]: data[this.form_fined_by_court] ? data[this.form_fined_by_court]: false,
      [this.form_debarred_exam_university]: data[this.form_debarred_exam_university] ? data[this.form_debarred_exam_university]: false,
      [this.form_debarred_psc_company]: data[this.form_debarred_psc_company] ? data[this.form_debarred_psc_company] : false,
      [this.form_court_case_pending]: data[this.form_court_case_pending] ? data[this.form_court_case_pending]: false,
      [this.form_university_case_pending]: data[this.form_university_case_pending] ? data[this.form_university_case_pending]: false,
      [this.form_disciplinary_proceedings]: data[this.form_disciplinary_proceedings] ? data[this.form_disciplinary_proceedings] : false,
      [this.form_full_particulars] : this.workDetails.caseDescription,
      //[this.form_full_particulars]: data[this.form_full_particulars]
    });
    //this.requiredDesc();
  }

  OtherDetailsPatch(data) {
    this.workDetailsForm.patchValue({
      [this.form_total_exp_years]: data[this.form_total_exp_years],
      [this.form_total_exp_months]: data[this.form_total_exp_months],
      [this.form_break_in_emp]: data[this.form_break_in_emp],
      [this.form_employed_us]: data[this.form_employed_us] && data[this.form_employed_us] == '1' ? '1' : '0',
      [this.form_oc]: data[this.form_oc],
      [this.form_payslip]: data[this.form_payslip],
      [this.form_interviewed_by_us]: data[this.form_interviewed_by_us] && data[this.form_interviewed_by_us] == '1' ? '1' : '0',
      [this.form_post]: data[this.form_post],
      [this.form_when_interview]: this.dateConvertion(data[this.form_when_interview])
    });
    this.requiredValidator(data[this.form_employed_us] && data[this.form_employed_us] == '1' ? '1' : '0', this.form_oc, this.form_payslip);
    this.requiredValidator(data[this.form_interviewed_by_us] && data[this.form_interviewed_by_us] == '1' ? '1' : '0', this.form_post, this.form_when_interview);
    }

  EmploymentArrayPatch(data) {
    return this.fb.group({
      [this.form_employment_name_address]: [data.employerName, [this.glovbal_validators.address255()]],
      [this.form_duration_from]: [this.dateConvertion(data.durationFrom)],
      [this.form_duration_to]: [this.dateConvertion(data.durationTo)],
      [this.form_duration_year]: [data.year],
      [this.form_duration_month]: [data.month],
      [this.form_postion_field]: [data.positionHeld, [this.glovbal_validators.address255()]],
      [this.form_name_designation_supervisor]: [data.superiorNameWdDesignation, [this.glovbal_validators.address255()]],
      [this.form_nature_work]: [data.natureOfWorkDone, [this.glovbal_validators.address255()]],
      [this.form_gross_emploment]: [data.grossEmoluments, [this.glovbal_validators.address50()]],
      [this.form_reason_leaving]: [data.reasonForLeaving, [this.glovbal_validators.address255()]],
      [this.form_hr_contact_no]: [data.hrContactNumber, [this.glovbal_validators.mobileRegex()]],
      [this.form_hr_email]: [data.hrEmailId, [this.glovbal_validators.email()]],
      [this.form_hr_name]: [data.hrName, [this.glovbal_validators.alphaNum255()]],
    },
      
    )
  }

  initEmploymentArray() {
    return this.fb.group({
      [this.form_employment_name_address]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_duration_from]: [null],
      [this.form_duration_to]: [null],
      [this.form_duration_year]: [null],
      [this.form_duration_month]: [null],
      [this.form_postion_field]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_name_designation_supervisor]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_nature_work]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_gross_emploment]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address50()]],
      [this.form_reason_leaving]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_hr_contact_no]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.mobileRegex()]],
      [this.form_hr_email]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.email()]],
      [this.form_hr_name]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
    },
  
    )
  }

  formInitialize() {
    this.workDetailsForm = this.fb.group({
      [this.form_convicted_by_Court]: [null],
      [this.form_arrested]: [null],
      [this.form_prosecuted]: [null],
      [this.form_detention]: [null],
      [this.form_fined_by_court]: [null],
      [this.form_debarred_exam_university]: [null],
      [this.form_debarred_psc_company]: [null],
      [this.form_court_case_pending]: [null],
      [this.form_university_case_pending]: [null],
      [this.form_disciplinary_proceedings]: [null],
      [this.form_full_particulars]: [null, []],
      [this.form_total_exp_years]: [null],
      [this.form_total_exp_months]: [null],
      [this.form_break_in_emp]: [null, []],
      [this.form_employed_us]: ['0'], 
      [this.form_oc]: [null, []],
      [this.form_payslip]: [null, []],
      [this.form_interviewed_by_us]: ['0'],
      [this.form_post]: [null, []],
      [this.form_when_interview]: [null],
      [this.form_Employment_Array]: this.fb.array([])
    })
  }

  addToEmploymentArray() {
    let i = this.getEmploymentArr['controls'].length - 1;
    if (this.getEmploymentArr.valid) {
      if (this.getEmploymentArr && this.getEmploymentArr['controls'] && this.getEmploymentArr['controls'][i] && this.getEmploymentArr['controls'][i]['value'] && this.getEmploymentArr['controls'][i]['value'][this.form_employment_name_address]) {
        return this.getEmploymentArr.push(this.initEmploymentArray());
      } else {
        this.toast.warning("Please fill all the red highlighted fields to proceed further");
        this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Employment_Array]) as FormArray);
      }
    } else {
      this.toast.warning("Please fill all the red highlighted fields to proceed further");
      this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Employment_Array]) as FormArray);
    }
}

  removeEmploymentArray(i) {
    this.getEmploymentArr.removeAt(i);
  }

  radioChange(e, form) {
    if (form == 1) {
      this.requiredValidator(e.value, this.form_oc, this.form_payslip);
    } else {
      this.requiredValidator(e.value, this.form_post, this.form_when_interview);
    }
  }

  requiredValidator(value, form, form1) {
    if (value == '1') {
      this.workDetailsForm.get(form).setValidators([Validators.required, ]), { emitEvent: false };
      if (form1 == this.form_when_interview) {
        this.workDetailsForm.get(form1).setValidators([Validators.required]), { emitEvent: false };
      } else {
        this.workDetailsForm.get(form1).setValidators([Validators.required, ]), { emitEvent: false };
      }
    } else {
      this.workDetailsForm.patchValue({
        [form]: null,
        [form1]: null
      });
      this.workDetailsForm.get(form).clearValidators(), { emitEvent: false };
      this.workDetailsForm.get(form1).clearValidators(), { emitEvent: false };
    }
    this.workDetailsForm.get(form).updateValueAndValidity(), { emitEvent: false };
    this.workDetailsForm.get(form1).updateValueAndValidity(), { emitEvent: false };
  }

  requiredDesc() {
    let formValues = this.workDetailsForm.getRawValue();
    const bgvDetails = {
      [this.form_convicted_by_Court]: formValues[this.form_convicted_by_Court] && (formValues[this.form_convicted_by_Court] == '1' || formValues[this.form_convicted_by_Court] == true) ? '1' : '0',
      [this.form_arrested]: formValues[this.form_arrested] && (formValues[this.form_arrested] == '1' || formValues[this.form_arrested] == true) ? '1' : '0',
      [this.form_prosecuted]: formValues[this.form_prosecuted] && (formValues[this.form_prosecuted] == '1' || formValues[this.form_prosecuted] == true) ? '1' : '0',
      [this.form_detention]: formValues[this.form_detention] && (formValues[this.form_detention] == '1' || formValues[this.form_detention] == true) ? '1' : '0',
      [this.form_fined_by_court]: formValues[this.form_fined_by_court] && (formValues[this.form_fined_by_court] == '1' || formValues[this.form_fined_by_court] == true) ? '1' : '0',
      [this.form_debarred_exam_university]: formValues[this.form_debarred_exam_university] && (formValues[this.form_debarred_exam_university] == '1' || formValues[this.form_debarred_exam_university] == true) ? '1' : '0',
      [this.form_debarred_psc_company]: formValues[this.form_debarred_psc_company] && (formValues[this.form_debarred_psc_company] == '1' || formValues[this.form_debarred_psc_company] == true) ? '1' : '0',
      [this.form_court_case_pending]: formValues[this.form_court_case_pending] && (formValues[this.form_court_case_pending] == '1' || formValues[this.form_court_case_pending] == true) ? '1' : '0',
      [this.form_university_case_pending]: formValues[this.form_university_case_pending] && (formValues[this.form_university_case_pending] == '1' || formValues[this.form_university_case_pending] == true) ? '1' : '0',
      [this.form_disciplinary_proceedings]: formValues[this.form_disciplinary_proceedings] && (formValues[this.form_disciplinary_proceedings] == '1' || formValues[this.form_disciplinary_proceedings] == true) ? '1' : '0',
      [this.form_full_particulars]: formValues[this.form_full_particulars]
    }
    if (bgvDetails[this.form_convicted_by_Court] == '1' || bgvDetails[this.form_arrested] == '1' || bgvDetails[this.form_prosecuted] == '1' || bgvDetails[this.form_detention] == '1' || bgvDetails[this.form_fined_by_court] == '1' || bgvDetails[this.form_debarred_exam_university] == '1' || bgvDetails[this.form_debarred_psc_company] == '1' || bgvDetails[this.form_court_case_pending] == '1' || bgvDetails[this.form_university_case_pending] == '1' || bgvDetails[this.form_disciplinary_proceedings] == '1') {
      this.workDetailsForm.get(this.form_full_particulars).setValidators([Validators.required, ]), { emitEvent: false };
    } else {
      this.workDetailsForm.get(this.form_full_particulars).setValidators([]), { emitEvent: false };
    }
    this.workDetailsForm.get(this.form_full_particulars).updateValueAndValidity(), { emitEvent: false };
  }

  formSubmit(routeValue?: any) {
    var email =this.userDetails.email ? this.userDetails.email :null
    let formValues = this.workDetailsForm.getRawValue();
    if (this.workDetailsForm.valid) {
    const apiData = {
      type : "experienceDetails",
      emailId : email,
      experienceDetails  : {
        employeementDetails : formValues[this.form_Employment_Array],
        [this.form_oc]: formValues[this.form_oc],
        [this.form_payslip]: formValues[this.form_payslip],
        [this.form_post]: formValues[this.form_post],
        [this.form_when_interview]: formValues[this.form_when_interview],
        [this.form_total_exp_years] : formValues[this.form_total_exp_years] ? formValues[this.form_total_exp_years] : null,
        [this.form_total_exp_months] : formValues[this.form_total_exp_months] ? formValues[this.form_total_exp_months] : null,
        [this.form_full_particulars] : formValues[this.form_full_particulars],
        [this.form_break_in_emp] : formValues[this.form_break_in_emp],
        disciplinaryDetails : {
            [this.form_convicted_by_Court]: formValues[this.form_convicted_by_Court] ?formValues[this.form_convicted_by_Court]:false,
            [this.form_debarred_exam_university]: formValues[this.form_debarred_exam_university] ?formValues[this.form_debarred_exam_university]:false ,
            [this.form_arrested]: formValues[this.form_arrested] ? formValues[this.form_arrested]:false,
            [this.form_debarred_psc_company]: formValues[this.form_debarred_psc_company] ?formValues[this.form_debarred_psc_company]:false,
            [this.form_prosecuted]: formValues[this.form_prosecuted] ?formValues[this.form_prosecuted]:false ,
            [this.form_detention]: formValues[this.form_detention] ? formValues[this.form_detention]:false,
            [this.form_university_case_pending]: formValues[this.form_university_case_pending] ? formValues[this.form_university_case_pending]:false,
            [this.form_fined_by_court]: formValues[this.form_fined_by_court] ?formValues[this.form_fined_by_court]:false,
            [this.form_disciplinary_proceedings]: formValues[this.form_disciplinary_proceedings] ? formValues[this.form_disciplinary_proceedings]:false,
            [this.form_court_case_pending] : formValues[this.form_court_case_pending] ? formValues[this.form_court_case_pending]:false,
        }
    }
    }
    this.saveExperienceDetails(apiData);
  }
  else{
    this.toast.warning("Invalid User details");
  }
  }

  saveExperienceDetails(apiData){
    this.commonService.postKycUserDetails(apiData).subscribe((result:any)=>{
      if(result.success){
        this.toast.success(result.message);
        this.navigatePrevNext('Preview')
      }
      else{
        this.toast.warning(result.message);
      }
    });
  }

  detectDateCalc(form, i) {
      let yearCount = 0;
      let monthCount = 0;
      let element = form.value;
      if (element[this.form_duration_from] && element[this.form_duration_to]) {
        let eventStartTime = new Date(`${this.momentForm1(element[this.form_duration_from])}`);
        let eventEndTime = new Date(`${this.momentForm1(element[this.form_duration_to])}`);
        let m = moment(eventEndTime);
        let years = m.diff(eventStartTime, 'years');
        m.add(-years, 'years');
        let months = m.diff(eventStartTime, 'months');
        m.add(-months, 'months');
        let days = m.diff(eventStartTime, 'days');

        this.getEmploymentArr.at(i).patchValue({
            [this.form_duration_month]: months,
            [this.form_duration_year]: years
        });

          this.getEmploymentArr.getRawValue().forEach(ele => {
          monthCount += Number(ele[this.form_duration_month] ? ele[this.form_duration_month] : 0);
          yearCount += Number(ele[this.form_duration_year] ? ele[this.form_duration_year] : 0);
          if (monthCount > 12) {
            let y; let m;
            y = Math.floor(monthCount / 12);
            m = monthCount % 12;
            this.workDetailsForm.patchValue({
              [this.form_total_exp_years]: yearCount + y,
              [this.form_total_exp_months]: m
            })
          } else {
            this.workDetailsForm.patchValue({
              [this.form_total_exp_years]: yearCount,
              [this.form_total_exp_months]: monthCount
            })
          }
        });

      }
  }

  // Form getters
  // convenience getters for easy access to form fields
  get getEmploymentArr() { return this.workDetailsForm.get([this.form_Employment_Array]) as FormArray; }

  get convicted_by_Court() {
    return this.workDetailsForm.get(this.form_convicted_by_Court);
  }
  get arrested() {
    return this.workDetailsForm.get(this.form_arrested);
  }
  get prosecuted() {
    return this.workDetailsForm.get(this.form_prosecuted);
  }
  get detention() {
    return this.workDetailsForm.get(this.form_detention);
  }
  get fined_by_court() {
    return this.workDetailsForm.get(this.form_fined_by_court);
  }
  get debarred_exam_university() {
    return this.workDetailsForm.get(this.form_debarred_exam_university);
  }
  get debarred_psc_company() {
    return this.workDetailsForm.get(this.form_debarred_psc_company);
  }
  get court_case_pending() {
    return this.workDetailsForm.get(this.form_court_case_pending);
  }
  get university_case_pending() {
    return this.workDetailsForm.get(this.form_university_case_pending);
  }
  get disciplinary_proceedings() {
    return this.workDetailsForm.get(this.form_disciplinary_proceedings);
  }
  get full_particulars() {
    return this.workDetailsForm.get(this.form_full_particulars);
  }
  get total_exp_years() {
    return this.workDetailsForm.get(this.form_total_exp_years);
  }
  get total_exp_months() {
    return this.workDetailsForm.get(this.form_total_exp_months);
  }
  get break_in_emp() {
    return this.workDetailsForm.get(this.form_break_in_emp);
  }
  get employed_us() {
    return this.workDetailsForm.get(this.form_employed_us);
  }
  get oc() {
    return this.workDetailsForm.get(this.form_oc);
  }
  get payslip() {
    return this.workDetailsForm.get(this.form_payslip);
  }
  get interviewed_by_us() {
    return this.workDetailsForm.get(this.form_interviewed_by_us);
  }
  get post() {
    return this.workDetailsForm.get(this.form_post);
  }
  get when_interview() {
    return this.workDetailsForm.get(this.form_when_interview);
  }

  navigatePrevNext(type){
    this.utilService.kyctabSubject.next(type);
  }
  
  ngOnDestroy() {
    this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
    this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
  }

}