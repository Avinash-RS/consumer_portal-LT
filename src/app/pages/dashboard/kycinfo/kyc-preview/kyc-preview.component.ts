import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { CommonService } from 'src/app/services/common.service';
import { GlobalValidatorService } from 'src/app/services/global-validator.service';
import { UtilityService } from 'src/app/services/utility.service';
import Swal from 'sweetalert2';

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
  selector: 'app-kyc-preview',
  templateUrl: './kyc-preview.component.html',
  styleUrls: ['./kyc-preview.component.scss']
})

export class KycPreviewComponent implements OnInit, AfterViewInit,OnDestroy {

  @ViewChild('matDialog', { static: false }) matDialogRef: TemplateRef<any>;
  @ViewChild('matDialogTerms', { static: false }) matDialogRefTerms: TemplateRef<any>;
  @ViewChild('matDialogBGV', { static: false }) matDialogRefBGV: TemplateRef<any>;
  @ViewChild('matDialogCaste', { static: false }) matDialogRefCaste: TemplateRef<any>;
  @ViewChild('matDialogCoc', { static: false }) matDialogRefCoc: TemplateRef<any>;
  @ViewChild('matDialogJoin', { static: false }) matDialogRefJoin: TemplateRef<any>;
  @ViewChild('matDialogDocViewer', { static: false }) matDialogRefDocViewer: TemplateRef<any>;

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

  checkFormValidRequest: Subscription;
  minDate: Date;
  maxDate: Date;

  showSizeError = {
    image: false,
    size: false,
    maxsize: '',
    minsize: ''
  };
  signature = null;

  selectedImage: any;
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
  form_name = 'name';
  form_dob = 'dob';
  form_gender = 'gender';
  form_place_of_birth = 'place_of_birth';
  form_state_of_birth = 'state_of_birth';
  form_nationality = 'nationality';
  form_mother_tongue = 'mother_tongue';
  form_religion = 'religion';
  form_caste = 'caste';
  form_category = 'category';
  form_blood_group = 'blood_group';
  form_father_name = 'father_name';
  form_emergency_contact = 'emergency_contact_no';
  form_mobile = 'mobile';
  form_email = 'email';
  form_aadhar = 'aadharno';
  form_pan = 'pan_no';
  form_offer_reference = 'offer_reference';
  form_offer_date = 'offer_date';
  form_height = 'height';
  form_weight = 'weight';
  form_identification_mark1 = 'identification_mark1';
  form_identification_mark2 = 'identification_mark2';
  form_emergency_contact_name = 'emergency_contact_name';
  form_emergency_contact_relation = 'emergency_contact_relation';
  form_personal_email = 'personal_email';
  form_marital_status = 'marital_status';
  form_domicile_state = 'domicile_state';
  form_no_of_children = 'no_of_children';

  // Form control name declaration end

  form_present_address_1 = 'present_line_street_addres';
  form_present_address_2 = 'present_line2_street_addre';
  form_present_address_3 = 'present_address_line_3';
  form_present_city = 'present_city';
  form_present_state = 'present_state';
  form_present_zip_code = 'present_zip';
  form_present_region = 'present_country';
  form_same_as_checkbox = 'same_as_checkbox';
  form_permanent_address_1 = 'permanent_line1_street_add';
  form_permanent_address_2 = 'permanent_line2_street_add';
  form_permanent_address_3 = 'permanent_address_line_3';
  form_permanent_city = 'permanent_city';
  form_permanent_state = 'permanent_state';
  form_permanent_zip_code = 'permanent_zip';
  form_permanent_region = 'permanent_country';

  // Dependent
  form_dependent_name = 'name_of_your_family';
  form_dependent_dob = 'family_date_of_birth';
  form_dependent_relationship = 'relationship';
  form_dependent_occupation = 'occupation';
  form_dependent_differently_abled = 'differently_abled';
  form_dependent_status = 'status';
  form_isDependent = 'dependent'

  // Education
  form_educationArray = 'educationDetails';
  form_qualification_type = 'qualificationType';
  form_qualification = 'qualification';
  form_specialization = 'specialization';
  form_collegeName = 'instituteName';
  form_boardUniversity = 'university';
  form_startDate = 'startDate';
  form_endDate = 'endDate';
  form_yearpassing = 'yearOfPassing';
  form_backlog = 'noOfBackLogs';
  form_mode = 'mode';
  form_cgpa = 'percentage';
  form_finalcgpa = 'finalPercentage';

  // Upload
  form_file_id = 'file_id';
  form_id = 'id';
  form_file_path = 'file_path';
  form_file_type = 'filetype';
  form_file_size = 'file_size';
  form_file_name = 'filename';
  form_name_document = 'name';
  form_label = 'label';
  form_description = 'description';
  form_Not_Submitted_Description = 'not_submitted_description';
  form_expectedDate = 'expected_date';
  form_semesterArray = 'sub_documents';
  form_noofSemester = 'no_of_semester';
  form_education_level = 'Education_Level';
  form_bankArray = 'bank';
  form_acc_no = 'account_no';
  form_ifsc_code = 'ifsc_code';
  form_branch = 'branch';

  pdfsrc: any;

  // Acknowledgements
  acknowledgmentForm: FormGroup;
  form_bgv = 'bkgdVerifDecl';
  form_caste_preview = 'casteDecl';
  form_coc = 'codeOfConductDecl';
  form_joining = 'joiningDecl';
  form_terms_conditions = 'teamsNdCondDecl';
  form_ack_place = 'ackPlace';
  form_ack_date = 'ackDate';

  // Work details
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

  passportdetails :any
  personalDetails: any;
  personalDetailsMap: any;
  contactDetails: any;
  contactDetailsMap: any;
  dependentDetails: any;
  dependentDetailsMap: any;
  educationDetails: any;
  educationDetailsMap: any;
  workDetails: any;
  workDetailsMap: any;
  ackdetails:any;
  getAllStates: any;
  url: any;
  nonMergedPersonalDetails: any;
  allPresentCityList: any;
  allPermanentCityList: any;
  formSubmitted: boolean;
  documentDetails: any;
  actualDate: any;
  noShowWork: boolean;
  userDetails:any;
  Countries;
  secondaryPersonalDetails;

  constructor(
    private utilService:UtilityService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public commonService: CommonService,
    public toast: ToastrService,
    private glovbal_validators: GlobalValidatorService,
    private router: Router,
    private cart :CartService
  ) {
    this.dateValidation();
  }

  ngOnInit() {
    this.userDetails =  JSON.parse(sessionStorage.getItem('userDetails'));
    this.formInitialization();
    this.checkFormSubmitted();
    this.getStateAPI();
    this.getPreviewData()
  }
  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }
  getPreviewData() {
    var userID = this.userDetails.userId ? this.userDetails.userId : "";
    this.personalDetails = null;
    this.contactDetails = null;
    this.educationDetails = null;
    this.passportdetails = null;
    this.workDetails  = null;
    this.ackdetails = null;
    this.commonService.getKycUserDetails(userID).subscribe((result:any)=>{
      if(result.success){
        this.personalDetails = result.data.profile;
        this.personalDetails.email = result.data.email;
        this.personalDetails.firstname = result.data.firstname;
        this.contactDetails = result.data.contactDetails;
        this.educationDetails = result.data.educationDetails;
        this.passportdetails = result.data.IdentityDetails;
        this.workDetails = result.data.experienceDetails;
        this.ackdetails = result.data.ackDeclDetails;
        this.secondaryPersonalDetails = result.data.personalDetails;
        if(this.personalDetails){
          this.patchPersonalForm();
        }
        if(this.contactDetails){
          this.patchContactForm();
        }
        if(this.educationDetails){
          this.patchEducation();
        }
        if(this.ackdetails){
          this.patchACkdetails();
        }
      }
      else{
        this.personalDetails = null;
        this.contactDetails = null;
        this.educationDetails = null;
        this.passportdetails = null;
        this.workDetails  = null;
        this.ackdetails = null;
      }
    });

  }
patchACkdetails(){
  this.acknowledgmentForm.patchValue({
        // [this.form_bgv] : this.ackdetails.bkgdVerifDecl ? this.ackdetails.bkgdVerifDecl : false,
        // [this.form_coc] : this.ackdetails.codeOfConductDecl ? this.ackdetails.codeOfConductDecl : false,
        // [this.form_caste_preview] : this.ackdetails.casteDecl ? this.ackdetails.casteDecl : false,
        // [this.form_joining] : this.ackdetails.joiningDecl ? this.ackdetails.joiningDecl : false,
        [this.form_terms_conditions] : this.ackdetails.teamsNdCondDecl ? this.ackdetails.teamsNdCondDecl : false,
        [this.form_ack_place]: this.ackdetails.ackPlace ? this.ackdetails.ackPlace : null,
        [this.form_ack_date] : this.ackdetails.ackDate ? this.ackdetails.ackDate : null,
  })
   //this.signature = this.ackdetails.signature ? this.ackdetails.signature :null;
}
  dateValidation() {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 0, 0, 1);
    this.maxDate = new Date(currentYear + 1, 0, 0);
  }

  momentForm(date) {
    if (date) {
      const split = moment(date).format('DD-MM-YYYY');
      return split;
    }
  }

  dateConvertionForm(date) {
    if (date) {
      const split = moment(date).format();
      if (split == 'Invalid date') {
        const ddFormat = moment(date, 'DD-MM-YYYY').format();
        return ddFormat == 'Invalid date' ? null : ddFormat;
      }
      return split == 'Invalid date' ? null : split;
    }
  }

  checkFormSubmitted() {
   
  }


  getStateAPI() {

    const datas = {
      country_id: '101'
    };

  }

  getBloodGroup() {

  }

  dateConvertion(date) {
    if (date) {
      const split = moment(date).format('DD MMM YYYY');
      if (split == 'Invalid date') {
        const ddFormat = moment(date, 'DD-MM-YYYY').format('DD MMM YYYY');
        return ddFormat == 'Invalid date' ? null : ddFormat;
      }
      return split == 'Invalid date' ? null : split;
    }
  }

  dateConvertionMonth(date) {
    if (date) {
      const split = moment(date).format('MMM YYYY');
      if (split == 'Invalid date') {
        const ddFormat = moment(date, 'DD-MM-YYYY').format('MMM YYYY');
        return ddFormat == 'Invalid date' ? null : ddFormat;
      }
      return split == 'Invalid date' ? null : split;
    }
  }

  formInitialization() {
    this.acknowledgmentForm = this.fb.group({
      // [this.form_bgv]: [null, [Validators.requiredTrue]],
      // [this.form_caste_preview]: [null, [Validators.requiredTrue]],
      // [this.form_coc]: [null, [Validators.requiredTrue]],
      // [this.form_joining]: [null, [Validators.requiredTrue]],
      [this.form_terms_conditions]: [null, [Validators.requiredTrue]],
      [this.form_ack_place]: [null, [Validators.required,]],
      [this.form_ack_date]: [{ value: this.dateConvertionForm(new Date()), disabled: true }, [Validators.required]]
    });
  }

  patchAcknowledgementForm(data) {
    this.acknowledgmentForm.patchValue(data);
  }

  patchingCriminal() {
    let bgv;
    if (this.workDetails.bgvDetails) {
      let data = this.workDetails.bgvDetails;
      bgv = {
        [this.form_convicted_by_Court]: data[this.form_convicted_by_Court] && data[this.form_convicted_by_Court] == '1' ? true : false,
        [this.form_arrested]: data[this.form_arrested] && data[this.form_arrested] == '1' ? true : false,
        [this.form_prosecuted]: data[this.form_prosecuted] && data[this.form_prosecuted] == '1' ? true : false,
        [this.form_detention]: data[this.form_detention] && data[this.form_detention] == '1' ? true : false,
        [this.form_fined_by_court]: data[this.form_fined_by_court] && data[this.form_fined_by_court] == '1' ? true : false,
        [this.form_debarred_exam_university]: data[this.form_debarred_exam_university] && data[this.form_debarred_exam_university] == '1' ? true : false,
        [this.form_debarred_psc_company]: data[this.form_debarred_psc_company] && data[this.form_debarred_psc_company] == '1' ? true : false,
        [this.form_court_case_pending]: data[this.form_court_case_pending] && data[this.form_court_case_pending] == '1' ? true : false,
        [this.form_university_case_pending]: data[this.form_university_case_pending] && data[this.form_university_case_pending] == '1' ? true : false,
        [this.form_disciplinary_proceedings]: data[this.form_disciplinary_proceedings] && data[this.form_disciplinary_proceedings] == '1' ? true : false,
        [this.form_full_particulars]: data[this.form_full_particulars]
      }
    } else {
      bgv = {
        [this.form_convicted_by_Court]: null,
        [this.form_arrested]: null,
        [this.form_prosecuted]: null,
        [this.form_detention]: null,
        [this.form_fined_by_court]: null,
        [this.form_debarred_exam_university]: null,
        [this.form_debarred_psc_company]: null,
        [this.form_court_case_pending]: null,
        [this.form_university_case_pending]: null,
        [this.form_disciplinary_proceedings]: null,
        [this.form_full_particulars]: null
      }
    }

    if (
      bgv[this.form_convicted_by_Court] ||
      bgv[this.form_arrested] ||
      bgv[this.form_prosecuted] ||
      bgv[this.form_detention] ||
      bgv[this.form_fined_by_court] ||
      bgv[this.form_debarred_exam_university] ||
      bgv[this.form_debarred_psc_company] ||
      bgv[this.form_court_case_pending] ||
      bgv[this.form_university_case_pending] ||
      bgv[this.form_disciplinary_proceedings]) {
      bgv.show = true;
    } else {
      bgv.show = false;
    }
    this.workDetails.bgvDetails = bgv;
  }
  patchWorkDetails() {
    if (this.workDetails.employeementDetails && this.workDetails.employeementDetails.length > 0) {
      let experience = [];
      this.workDetails.Employment.forEach(element => {
        if (element && element[this.form_employment_name_address]) {
          experience.push(element);
        }
      });
      this.workDetails.Employment = experience;
    }
    if (this.workDetails.workDetails) {
      let work = this.workDetails.workDetails;
      work[this.form_break_in_emp] = work[this.form_break_in_emp] ? work[this.form_break_in_emp] : null;
      work[this.form_employed_us] = work[this.form_employed_us] == '1' ? true : false;
      work[this.form_interviewed_by_us] = work[this.form_interviewed_by_us] == '1' ? true : false;
      work[this.form_total_exp_months] = work[this.form_total_exp_months] ? Number(work[this.form_total_exp_months]) : 0;
      work[this.form_total_exp_years] = work[this.form_total_exp_years] ? Number(work[this.form_total_exp_years]) : 0;
      this.workDetails.workDetails = work;
    }
  }

  getWorkApiDetails(datas) {
    if (datas && datas['work_experience']) {
      let data = datas['work_experience'];
      let work = {
        workDetails: data && data.workDetails ? data.workDetails : null,
        Employment: data && data.Employment ? data.Employment : [],
        bgvDetails: data && data.bgvDetails ? data.bgvDetails : null
      }
      this.workDetails = work;
      this.patchWorkDetails();
      this.patchingCriminal();
      if ((work.workDetails && (work.workDetails.break_in_emp || work.workDetails.employed_us == '1' || work.workDetails.interviewed_by_us == '1' || work.workDetails.total_exp_months || work.workDetails.total_exp_years)) || (this.workDetails.bgvDetails && this.workDetails.bgvDetails.show) || (work.Employment && work.Employment.length > 0 && work.Employment[0] && work.Employment[0][this.form_employment_name_address] )) {
        this.noShowWork = false;
      } else {
        this.noShowWork = true;
      }
    } else {
      this.workDetails = null;
    }
}

  customEducationLabel(label) {
    if (label == 'SSLC') {
      return 'SSLC/10th';
    }
    if (label == 'HSC') {
      return 'HSC/12th';
    }
    if (label == 'UG') {
      return 'Undergraduate';
    }
    if (label == 'PG') {
      return 'Postgraduate';
    }
    return label;
  }

  patchEducation() {
    this.educationDetailsMap = [];
    this.educationDetails.forEach(element => {
      if (element) {
        if (element[this.form_qualification_type] == 'SSLC') {
          element[this.form_qualification_type] = element[this.form_qualification_type] ? 'SSLC/10th' : 'NA';
        }
        if (element[this.form_qualification_type] == 'HSC') {
          element[this.form_qualification_type] = element[this.form_qualification_type] ? 'HSC/12th' : 'NA';
        }
        if (element[this.form_qualification_type] == 'UG') {
          element[this.form_qualification_type] = element[this.form_qualification_type] ? 'Undergraduate' : 'NA';
        }
        if (element[this.form_qualification_type] == 'PG') {
          element[this.form_qualification_type] = element[this.form_qualification_type] ? 'Postgraduate' : 'NA';
        }

        element[this.form_qualification_type] = element?.[this.form_qualification_type] ? element?.[this.form_qualification_type] : 'NA';
        element[this.form_qualification] = element?.[this.form_qualification] ? element?.[this.form_qualification] : 'NA';
        element[this.form_boardUniversity] = element?.[this.form_boardUniversity] ? element?.[this.form_boardUniversity] : 'NA';
        element[this.form_collegeName] = element?.[this.form_collegeName] ? element?.[this.form_collegeName] : 'NA';
        element[this.form_specialization] = element?.[this.form_specialization] ? element?.[this.form_specialization] : 'NA';
        element[this.form_cgpa] = element?.[this.form_cgpa] ? element?.[this.form_cgpa] : 'NA';
        element[this.form_finalcgpa] = element?.[this.form_finalcgpa] ? element?.[this.form_finalcgpa] : 'NA';
        element[this.form_backlog] = element?.[this.form_backlog] ? element?.[this.form_backlog] : 'NA';
        element[this.form_startDate] = element[this.form_startDate] ? this.dateConvertion(element[this.form_startDate]) : 'NA';
        element[this.form_endDate] = element[this.form_endDate] ? this.dateConvertion(element[this.form_endDate]) : 'NA';
        element[this.form_yearpassing] = element[this.form_yearpassing] ? this.dateConvertionMonth(element[this.form_yearpassing]) : 'NA';
        element[this.form_mode] = element[this.form_mode] == 'fulltime' ? 'Full time' : element[this.form_mode] == 'parttime' ? 'Part-time' : 'NA';
        this.educationDetailsMap.push(element);
      }
    });
  }

  patchDependent() {
    this.dependentDetailsMap = [];
    this.dependentDetails.forEach(element => {
      if (element) {
        element[this.form_dependent_dob] = element?.[this.form_dependent_dob] ? this.dateConvertion(element[this.form_dependent_dob]) : 'NA';
        element[this.form_dependent_differently_abled] = element?.[this.form_dependent_differently_abled] == '1' ? 'Yes' : element[this.form_dependent_differently_abled] == '0' ? 'No' : 'NA';
        element[this.form_dependent_status] = element?.[this.form_dependent_status] == '1' ? 'Active' : element[this.form_dependent_status] == '0' ? 'Inactive' : 'NA';
        element[this.form_isDependent] = element?.[this.form_isDependent] == '1' ? 'Yes' : element[this.form_isDependent] == '0' ? 'No' : 'NA';
        element[this.form_dependent_occupation] = element?.[this.form_dependent_occupation] ? element[this.form_dependent_occupation] : 'NA';
        this.dependentDetailsMap.push(element);
      }
    });
  }

  getAllPresentCities(id, cityId, callback) {
    const ApiData = {
      state_id: id
    };
    let city;
  }

  getAllPermanentCities(id, cityId, callback) {
    const ApiData = {
      state_id: id
    };
    let city;

  }


  patchContactForm() {

    const data = {

      [this.form_present_address_1]: this.contactDetails.present.address1 ? this.contactDetails.present.address1:'NA',
      // [this.form_present_address_2]: this.contactDetails.present.address2 ? this.contactDetails.present.address2:'NA',
      // [this.form_present_address_3]: this.contactDetails.present.address3 ? this.contactDetails.present.address3:'NA',
      [this.form_present_city]: this.contactDetails.present.city ? this.contactDetails.present.city:'NA',
      [this.form_present_state]: this.contactDetails.present.state ?this.contactDetails.present.state:'NA',
      [this.form_present_region]: this.contactDetails.present.country ?this.contactDetails.present.country:'NA',
      [this.form_present_zip_code]: this.contactDetails.present.zipCode ?this.contactDetails.present.zipCode:'NA',
      [this.form_same_as_checkbox]: this.contactDetails.isSamePermanent ?this.contactDetails.isSamePermanent:false,
      [this.form_permanent_address_1]: this.contactDetails.permanent.per_address1 ?this.contactDetails.permanent.per_address1:'NA',
      // [this.form_permanent_address_2]: this.contactDetails.permanent.per_address2 ?this.contactDetails.permanent.per_address2:'NA',
      // [this.form_permanent_address_3]: this.contactDetails.permanent.per_address3 ?this.contactDetails.permanent.per_address3:'NA',
      [this.form_permanent_city]: this.contactDetails.permanent.per_state ?this.contactDetails.permanent.per_city:'NA',
      [this.form_permanent_state]: this.contactDetails.permanent.per_city ?this.contactDetails.permanent.per_state:'NA',
      [this.form_permanent_region]: this.contactDetails.permanent.per_country ?this.contactDetails.permanent.per_country :'NA',
      [this.form_permanent_zip_code]:  this.contactDetails.permanent.per_zipCode ?this.contactDetails.permanent.per_zipCode:'NA'
    };
    this.contactDetailsMap = data;

    this.contactDetailsMap.presentAddress =  this.contactDetails.present.address1 ? this.contactDetails.present.address1:'NA';
   
    this.contactDetailsMap.permanentAddress = this.contactDetails.permanent.per_address1 ?this.contactDetails.permanent.per_address1:'NA';

  }
  getCountry(){
    this.cart.getCountryDetails().subscribe((result:any)=>{
      if(result.success){
        this.Countries = result.data;
      }
     });
  }

  patchPersonalForm() {
  var gender = 'NA';  
  //Gender
  if(this.personalDetails.gender){
    if(this.personalDetails.gender == 1){
      gender = 'Male'  
    }
   else if(this.personalDetails.gender == 2){
      gender = 'Female'  
    }
    else if(this.personalDetails.gender == 3){
      gender = 'Others'  
    }
  }


    const data = {
      [this.form_name]: this.personalDetails.firstname ? this.personalDetails.firstname : 'NA',
      [this.form_dob]: this.personalDetails.dateOfBirth ? this.dateConvertion(this.personalDetails.dateOfBirth) : 'NA',
      [this.form_gender]: gender,
      [this.form_place_of_birth]: this.personalDetails?.placeOfBirth?  this.personalDetails?.placeOfBirth :'NA',
      [this.form_state_of_birth]: this.personalDetails.stateOfBirth ?  this.personalDetails.stateOfBirth :'NA',
      [this.form_nationality]: this.personalDetails.nationality ? this.personalDetails.nationality :'NA',
      // [this.form_mother_tongue]: this.personalDetails.motherTongue ? this.personalDetails.motherTongue :'NA',
      // [this.form_religion]: this.personalDetails.religion ? this.personalDetails.religion :'NA',
      // [this.form_caste]: this.personalDetails.casteName ? this.personalDetails.casteName :'NA',
      // [this.form_category]: this.personalDetails.casteCategory ? this.personalDetails.casteCategory :'NA',
      // [this.form_blood_group]: this.personalDetails.bloodGroup ? this.personalDetails.bloodGroup:'NA',
      // [this.form_father_name]: this.personalDetails.fatherName ? this.personalDetails.fatherName:'NA',
      // [this.form_emergency_contact]: this.personalDetails.emergencyContactNo ?  this.personalDetails.emergencyContactNo:'NA',
      [this.form_mobile]: this.personalDetails.phone ? this.personalDetails.phone :'NA',
      [this.form_email]: this.personalDetails.email ? this.personalDetails.email:'NA',
      // [this.form_aadhar]: this.personalDetails.aadharNo ? this.personalDetails.aadharNo:'NA',
      // [this.form_pan]: this.personalDetails.panNo ? this.personalDetails.panNo :'NA',
      // [this.form_offer_reference]: this.personalDetails.offerReference ? this.personalDetails.offerReference:'NA',
      // [this.form_offer_date]:this.personalDetails.offerDate? this.dateConvertion(this.personalDetails.offerDate):'NA',
      // [this.form_height]: this.personalDetails.heightInCm ? this.personalDetails.heightInCm :'NA',
      // [this.form_weight]: this.personalDetails.weightInKgs ? this.personalDetails.weightInKgs :'NA',
      // [this.form_identification_mark1]: this.personalDetails.identificationMark[0] ? this.personalDetails.identificationMark[0] :'NA',
      // [this.form_identification_mark2]: this.personalDetails.identificationMark[1] ? this.personalDetails.identificationMark[1] :'NA',
      //[this.form_emergency_contact_name]: this.personalDetails.emergencyContactPersonName ?this.personalDetails.emergencyContactPersonName:'NA',
      //[this.form_emergency_contact_relation]: this.personalDetails.relationwithEmergencyContact? this.personalDetails.relationwithEmergencyContact :'NA',
      [this.form_personal_email]: this.personalDetails.alternateEmailID ? this.personalDetails.alternateEmailID :'NA',
      [this.form_domicile_state]: this.personalDetails.domicileState ?  this.personalDetails.domicileState:'NA',
      //[this.form_marital_status]: this.personalDetails.maritalStatus ? this.personalDetails.maritalStatus:'NA',
      //[this.form_no_of_children]: this.personalDetails.noOfChildren? this.personalDetails.noOfChildren:'NA'
    };
    this.url = this.personalDetails.profileImage ? this.personalDetails.profileImage:null;
    this.personalDetailsMap = data;
  }



  formSubmitFinal() {
    if (this.acknowledgmentForm.valid) {
      const params ={
        email : this.userDetails.email ? this.userDetails.email :null
      }
      this.commonService.submitUserProfile(params).subscribe((result:any)=>{
        if(result.success){
          return this.matDialogOpen();
        }
        else{
          this.toast.warning(result.message);
        }
      })
      
    } else {
      this.glovbal_validators.validateAllFields(this.acknowledgmentForm);
      this.toast.warning('Please fill all the highlighted fields in Acknowledgements and Declarations')
    }
  }
  matDialogOpen() {
    const dialogRef = this.dialog.open(this.matDialogRef, {
      width: '400px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'popupModalContainerForForms'
    });
  }

  closeDialog(e) {
    if (e == 'save') {
      this.dialog.closeAll();
      this.formSubmit();
    } else {
      this.dialog.closeAll();
    }
  }

  matDialogOpenTerms(type) {
    let name;
    if (type == 'terms') {
      name = this.matDialogRefTerms;
    }
    if (type == 'bgv') {
      name = this.matDialogRefBGV;
    }
    if (type == 'coc') {
      name = this.matDialogRefCoc;
    }
    if (type == 'caste') {
      name = this.matDialogRefCaste;
    }
    if (type == 'join') {
      name = this.matDialogRefJoin;
    }

    const dialogRef = this.dialog.open(name, {
      width: '890px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'wrapper-kyc-terms'
    });
  }

  kycTerms() {
    const data = {
      iconName: '',
      sharedData: {
        confirmText: 'Bulk Upload helper video',
        componentData: '',
        type: 'kyc-terms',
        identity: 'kyc-terms'
      },
      showConfirm: 'Confirm',
      showCancel: 'Cancel',
      showOk: ''
    };
    
  }

  openMatDialog(src, type) {
    if (!type.includes('application/pdf')) {
      return window.open(src, '_blank');
    }
    this.pdfsrc = src;
    // this.pdfsrc = 'http://campus-qa.lntedutech.com/d8cintana2/sites/default/files/Templates/BGV_Declaration.pdf';
    const dialogRef = this.dialog.open(this.matDialogRefDocViewer, {
      width: '600px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'popupModalContainerForPDFViewer'
    });
  }
  closeBox() {
    this.dialog.closeAll();
  }

  formSubmit(routeValue?: any) {
    var email =this.userDetails.email ? this.userDetails.email :null
    let ackForm = this.acknowledgmentForm.getRawValue();
    const apidata = {
      type : "ackDeclDetails",
      emailId : email,
        ackDeclDetails : {
        [this.form_bgv] : ackForm[this.form_bgv],
        [this.form_coc] : ackForm[this.form_coc],
        [this.form_caste_preview] : ackForm[this.form_caste_preview],
        [this.form_joining] : ackForm[this.form_joining],
        [this.form_terms_conditions] : ackForm[this.form_terms_conditions],
        [this.form_ack_place]: ackForm[this.form_ack_place],
        [this.form_ack_date] : ackForm[this.form_ack_date],
        signature : this.signature
    },
    }
    this.commonService.postKycUserDetails(apidata).subscribe((result:any)=>{
      if(result.success){
        this.toast.success(result.message);
        this.utilService.percentageSubject.next(true);
        this.router.navigate(['/certificationHome'])
      }
      else{
        this.toast.warning(result.message);
      }
    }); 
  }





  //Form Getter
  get bgv() {
    return this.acknowledgmentForm.get(this.form_bgv);
  }
  get caste_preview() {
    return this.acknowledgmentForm.get(this.form_caste_preview);
  }
  get coc() {
    return this.acknowledgmentForm.get(this.form_coc);
  }
  get joining() {
    return this.acknowledgmentForm.get(this.form_joining);
  }
  get terms_conditions() {
    return this.acknowledgmentForm.get(this.form_terms_conditions);
  }
  get ack_place() {
    return this.acknowledgmentForm.get(this.form_ack_place);
  }
  get ack_date() {
    return this.acknowledgmentForm.get(this.form_ack_date);
  }



  public delete() {
    this.signature = {
      name: null,
      file_id: null,
      file_path: null,
      file_size: null,
      filename: null,
      filetype: null,
      label: null
    };
  }
  onSelectFile(event) {
    if (event.target.files && (event.target.files[0].type.includes('image/png') || event.target.files[0].type.includes('image/jp')) && !event.target.files[0].type.includes('svg')) {
      if (event.target.files[0].size < 2000000) {
        let image = event.target.files[0];
        const formData = new FormData();
        formData.append('image', image);
        formData.append('pathName', 'signature');
        this.commonService.getprofileImgUpdate(formData).subscribe((data: any) => {
          if (data.data.path) {
            this.signature = data.data.url;
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
  KycData(){
    const data = {
      "firstName": "Prasanth R",
      "lastName" : "",
      "emailId" : "prasanth-3@lntecc.com",
      "phone" : "9025993337",
      "dob" : "1992-05-12",
      "gender" : "",
      "profileImage" : "",
      "maritalStatus" : "",
      "noOfChildren" : "",
      "domicileState" : "",
      "placeOfBirth" : "",
      "stateOfBirth" : "",
      "nationality" : "",
      "motherTongue" : "",
      "religion" : "",
      "bloodGroup" : "",
      "casteCategory" : "",
      "casteName" : "",
      "fatherName" : "",
      "emergencyContactNo" : "",
      "emergencyContactPersonName" : "",
      "relationwithEmergencyContact" : "",
      "aadharNo" : "",
      "panNo" : "",
      "offerReference" : "",
      "offerDate" : "1992-05-12",
      "heightInCm" : "",
      "weightInKgs" : "",
      "alternateEmailID" : "",
      "identificationMark" : "",
      "loginTime" : "1992-05-12",
      "contactDetails" : {
          "isSamePermanent" : true,
          "present" : {
              "address1" : "",
              "address2" : "",
              "address3" : "",
              "state" : "",
              "city" : "",
              "zipCode" : "",
              "country" : ""
          },
          "permanent" :  {
              "address1" : "",
              "address2" : "",
              "address3" : "",
              "state" : "",
              "city" : "",
              "zipCode" : "",
              "country" : ""
          }
      },
      "dependentDetails" : [
         {
              "name" : "String",
              "dob" : "1992-05-12",
              "relationship" : "",
              "occupation" : "",
              "differentlyAbled" : true,
              "status" : true,
              "isDependent" : true
          }
      ],
      "educationDetails" : [
          {
              "qualificationType" : "",
              "instituteName" : "",
              "university" : "",
              "startDate" : "1992-05-12",
              "endDate" : "1992-05-12",
              "yearOfPassing" : "",
              "noOfBackLogs" : 1,
              "mode" : "",
              "percentage" : ""
          }
      ],
      "experienceDetails"  : {
          "oc" : "",
          "payslipNo" : "",
          "postAppliedFor" : "",
          "appliedDate" : "1992-05-12",
          "disciplinaryDetails" : {
              "convicted_by_Law" : true,
              "debarredUniversity" : true,
              "arrested" : true,
              "debarredcompany" : true,
              "prosecuted" : true,
              "pendingCase" : true,
              "kept_under_detention" : true,
              "universityCasePending" : true,
              "finedCourtOfLaw" : true,
              "disciplinaryProblem" : true
          }
      }
  }
  return data;
  }
  navigatePrevNext(type){
    if(this.acknowledgmentForm.dirty){
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
  navigateParent(){
    this.utilService.ParentkyctabSubject.next(true);
  }

  ngOnDestroy() {
    this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
  }
}
