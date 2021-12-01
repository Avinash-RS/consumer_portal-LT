import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/services/utility.service';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalValidatorService } from 'src/app/services/global-validator.service';
import { RemoveWhitespace } from 'src/app/services/removewhitespace'; 
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
export const MY_FORMATS_Month = {
  parse: {
    dateInput: 'MM-YYYY',
  },
  display: {
    // dateInput: 'DD MMM YYYY', // output ->  01 May 1995
    dateInput: 'DD-MM', // output ->  01-10-1995
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-kyc-education',
  templateUrl: './kyc-education.component.html',
  styleUrls: ['./kyc-education.component.scss']
})



export class KycEducationComponent implements OnInit, AfterViewInit,OnDestroy {

  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  educationForm: FormGroup;
  minDate: Date;
  maxDate: Date;

  boardsList = [
    {
      label: 'State',
      value: 'State'
    },
    {
      label: 'CBSE',
      value: 'CBSE'
    }
  ];
  HSCDiscipline: [
    {
      name: 'Science',
      value: 'Science',
      checkbox: false
    },
    {
      name: 'Commerce',
      value: 'Commerce',
      checkbox: false
    },
    {
      name: 'Arts',
      value: 'Arts',
      checkbox: false
    },
    {
      name: 'Others',
      value: 'Others',
      checkbox: false
    }
  ];
  diplamoSpecialization = [
    {
      label: 'Diploma Engineering',
      value: 'Diploma Engineering'
    }
  ]

  modesList = [
    {
      label: 'Full time',
      value: 'fulltime'
    },
    {
      label: 'Part-time',
      value: 'parttime'
    }
  ]
  diffAbledDropdownList = [
    {
      label: 'Yes',
      value: 'yes'
    },
    {
      label: 'No',
      value: 'no'
    }
  ];
  activeDropdownList = [
    {
      label: 'Active',
      value: 'active'
    },
    {
      label: 'Inactive',
      value: 'inactive'
    }
  ];
  //form Variables
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
  form_Finalcgpa = 'finalPercentage';

  educationLevels: any;
  pgSpecializationList: any;
  ugSpecializationList: any;
  diplomaDisciplineList: any;
  pgDisciplineList: any;
  ugDisciplineList: any;
  diplomaInstitutesList: any;
  pgInstitutesList: any;
  ugInstitutesList: any;

educationDetails: any;
mastersList: any;
selectedPost: any;
selectedPostLabel: any;
educationLength: any;
maxDateStartField: any;
userDetails:any;
  constructor(
    private fb: FormBuilder,
    private utilService:UtilityService,
    public commonService: CommonService,
    public toast: ToastrService,
    private glovbal_validators: GlobalValidatorService
  ) {
    this.dateValidation();
  }

  ngOnInit() {
    this.userDetails =  JSON.parse(sessionStorage.getItem('userDetails'));
    this.getSelectedPost();
    this.formInitialize();
    this.getEducationDetails();
    // Getting required datas for dropdowns
    this.getEducationLevels();
    this.getUGSpecialization();
    this.getPGSpecialization();
    this.getDiplomaDiscipline();
    this.getUGDiscipline();
    this.getPGDiscipline();
    this.getDiplomaInstitutes();
    this.getUGandPGInstitutes();
    this.getEducationApiDetails();
    // End of Getting required datas for dropdowns

  }
  getEducationDetails(){
    var userID = this.userDetails.userId ? this.userDetails.userId : "";
    this.educationDetails = null;
    this.commonService.getKycUserDetails(userID).subscribe((result:any)=>{
      if(result.success){
        this.educationDetails = result.data.educationDetails;
        if(this.educationDetails){
          this.patchEducationForm();
        }
        else{
          this.educationDetails = null;
        }
      }
      else{
        this.educationDetails = null;
      }
    });
  }
  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  chosenYearHandler(normalizedYear: moment.Moment, i) {
    const ctrlValue = this.getEducationArr['value'][i][this.form_yearpassing];
    if (ctrlValue) {
      ctrlValue.year(normalizedYear.year());
      this.getEducationArr.at(i).patchValue({
        [this.form_yearpassing]: ctrlValue,
      });
    }
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, i) {
    if (this.dateConvertion(normalizedMonth['_d'])) {
    this.getEducationArr.at(i).patchValue({
      [this.form_yearpassing]: this.dateConvertionMonth(normalizedMonth['_d']),
    });
  }
    datepicker.close();
  }

  getSelectedPost() {
    this.mastersList = localStorage.getItem('masters') ? JSON.parse(localStorage.getItem('masters')) : '';
    this.selectedPost = 'pget';
    this.selectedPostLabel = 'pget';
    // this.mastersList?.education_master.forEach(element => {
    //   if (element.value == this.selectedPost) {
    //     this.selectedPostLabel = element.label;
    //   }
    // });
  }

  getEducationApiDetails() {
    if (true) {
      this.getEducationArr.push(this.initEducationArray());
    } else {
      this.patchEducationForm();
    }
  }

  getEducationLength(education) {
    let sp = this.selectedPost;
    let label = sp == 'det' ? 'Diploma' : (sp == 'get' || sp == 'gct') ? 'UG' : (sp == 'pget' || sp == 'pgct' || sp == 'pgt') ? 'PG' : 'PG';
    const findIndex = education.findIndex(data => data.level == label);
    this.educationLength = findIndex != -1 ? findIndex + 1 : 1;
  }

  initalPatchWithValidations() {
    for (let index = 0; index < 1; index++) {
      this.getEducationArr.push(this.initEducationArray());
      this.getEducationArr.at(0).patchValue({
        [this.form_qualification_type]: 'SSLC',
      });
      this.setValidations();
    }
  }


    educationLevelChange(i) {
        this.getEducationArr.at(i).patchValue({
          [this.form_qualification]: null,
          [this.form_specialization]: null,
          [this.form_collegeName]: null,
          [this.form_boardUniversity]: null,
          [this.form_startDate]: null,
          [this.form_endDate]: null,
          [this.form_yearpassing]: null,
          [this.form_backlog]: null,
          [this.form_mode]: null,
          [this.form_cgpa]: null,
          [this.form_Finalcgpa]: null
          });
     return this.setValidations();
    }

  dateValidation() {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 50, 0, 1);
    this.maxDate = new Date();
}

momentForm(date) {
if (date) {
  const split = moment(date).format('DD-MM-YYYY');
 return split;
}
}

momentFormMonth(date) {
  if (date) {
    const split = moment(date).format('MMM YYYY');
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

dateConvertionMonth(date) {
  if (date) {
    const split = moment(date).format();
    if (split == 'Invalid date') {
      const ddFormat = moment(date, 'DD-MM-YYYY').format();
      return ddFormat == 'Invalid date' ? null : ddFormat;
    }
   return split == 'Invalid date' ? null : split;
  }
}


validSelectedPost() {
  let valid;
    let value = {
      hscDiploma: false,
      ug: false,
      pg: false,
      label: ''
    };
    if (this.selectedPost == 'det') {
      this.getEducationArr.controls.forEach((element: any, j) => {
        if (element['controls'][this.form_qualification_type]['value'] == 'Diploma') {
          value.hscDiploma = true;
        }
      });
      valid = value.hscDiploma ? true : false;
      value.label = 'det';
      return {
        valid,
        value
      }
    }

    if (this.selectedPost == 'gct' || this.selectedPost == 'get') {
      this.getEducationArr.controls.forEach((element: any, j) => {
        if (element['controls'][this.form_qualification_type]['value'] == 'HSC' || element['controls'][this.form_qualification_type]['value'] == 'Diploma') {
          value.hscDiploma = true;
        }
        if (element['controls'][this.form_qualification_type]['value'] == 'UG') {
          value.ug = true;
        }
      });
      valid = value.hscDiploma && value.ug ? true : false;
      value.label = 'gct';
      return {
        valid,
        value
      }
    }
    if (this.selectedPost == 'pgct' || this.selectedPost == 'pget' || this.selectedPost == 'pgt') {
      this.getEducationArr.controls.forEach((element: any, j) => {
        if (element['controls'][this.form_qualification_type]['value'] == 'HSC' || element['controls'][this.form_qualification_type]['value'] == 'Diploma') {
          value.hscDiploma = true;
        }
        if (element['controls'][this.form_qualification_type]['value'] == 'UG') {
          value.ug = true;
        }
        if (element['controls'][this.form_qualification_type]['value'] == 'PG') {
          value.pg = true;
        }
      });
      valid = value.hscDiploma && value.ug && value.pg ? true : false;
      value.label = 'pgct';
      return {
        valid,
        value
      }
    }

}
  formSubmit() {
    var email =this.userDetails.email ? this.userDetails.email :null
    if (this.educationForm.valid) {
      var formArray = [];
      formArray=  this.educationForm.getRawValue()[this.form_educationArray];
        if(formArray.length > 0){
           this.saveEducationDetails(formArray);
        }
        else{
          this.toast.warning("Please fill Education Details");
        }
      } else {
        this.toast.warning("Please fill all mandatory fields");
    }
  }
  saveEducationDetails(formArray){
    var email = this.userDetails.email ? this.userDetails.email :null;
    const apiData = {
      type : "educationDetails",
      emailId : email,
      educationDetails : formArray
    }
    this.commonService.postKycUserDetails(apiData).subscribe((result:any)=>{
      if(result.success){
        this.toast.success(result.message);
        this.utilService.percentageSubject.next(true);
        this.utilService.kyctabSubject.next('Preview');
      }
      else{
        this.toast.warning(result.message);
      }
    });
  }


  patchEducationForm() {
    this.getEducationArr.clear();
    this.educationDetails.forEach((element, i) => {
      this.getEducationArr.push(this.patching(element, i));
    });
    this.setValidations();
  }

  patching(data, i) {
    return this.fb.group({
      [this.form_qualification_type]: [{ value: data.qualificationType, disabled: true }, [Validators.required]],
      [this.form_qualification]: [{ value: data.qualification, disabled: false }, [Validators.required]],
      [this.form_specialization]: [{ value: data.specialization, disabled: false }, [Validators.required]],
      [this.form_collegeName]: [{ value: data.instituteName, disabled: false }, [Validators.required]],
      [this.form_boardUniversity]: [{ value: data.university, disabled: false }, [Validators.required]],
      [this.form_startDate]: [this.dateConvertion(data.startDate), [Validators.required,this.startTrue(false)]],
      [this.form_endDate]: [this.dateConvertion(data.endDate), [Validators.required ,this.startTrue(false)]],
      [this.form_yearpassing]: [{ value: this.dateConvertionMonth(data.yearOfPassing), disabled: false }, [Validators.required , this.startTrue(true)]],
      //[this.form_backlog]: [{ value: data.noOfBackLogs, disabled: data[this.form_qualification_type] == 'SSLC' || data[this.form_qualification_type] == 'HSC' ? true : false }, [Validators.required,]],
      //[this.form_mode]: [{ value: data.mode, disabled: false }, [Validators.required]],
      [this.form_cgpa]: [{ value: data.percentage, disabled: false }, [Validators.required , this.glovbal_validators.percentageNew(), Validators.maxLength(5)]],
      //[this.form_Finalcgpa]: [(data[this.form_qualification_type] == 'SSLC' || data[this.form_qualification_type] == 'HSC' ? data.percentage : data.finalPercentage)],
    })
  }

  initEducationArray() {
    return this.fb.group({
      [this.form_qualification_type]: [null,[Validators.required]],
      [this.form_qualification]: [null,],
      [this.form_specialization]: [null,[Validators.required]],
      [this.form_collegeName]: [null,[Validators.required]],
      [this.form_boardUniversity]: [null,[Validators.required]],
      [this.form_startDate]: [null,[Validators.required , this.startTrue(false)]],
      [this.form_endDate]: [null,[Validators.required , this.startTrue(false)]],
      [this.form_yearpassing]: [null,[Validators.required , this.startTrue(true)]],
      //[this.form_backlog]: [null,[Validators.required]],
      // [this.form_mode]: [null,[Validators.required]],
      [this.form_cgpa]: [null,[RemoveWhitespace.whitespace(),Validators.required,this.glovbal_validators.percentageNew(), Validators.maxLength(5)]],
      // [this.form_Finalcgpa]: [null,[RemoveWhitespace.whitespace()]],
    })
  }

    // Custom regex validator
     // Custom regex validator
     regexValidator(error: ValidationErrors, param): ValidatorFn {
      return (control: AbstractControl): {[key: string]: any} => {
        if (!control.value) {
          return null;
        }
        let check;
        let yearofPassing = control && control['_parent'] && control['_parent']['controls'] && control['_parent']['controls'][this.form_yearpassing]['value'] ? control['_parent']['controls'][this.form_yearpassing]['value'] : null;
        let startDate = control && control['_parent'] && control['_parent']['controls'] && control['_parent']['controls'][this.form_yearpassing]['value'] ? control['_parent']['controls'][this.form_startDate]['value'] : null;
        let endDate = control && control['_parent'] && control['_parent']['controls'] && control['_parent']['controls'][this.form_yearpassing]['value'] ? control['_parent']['controls'][this.form_endDate]['value'] : null;
        if (yearofPassing) {
          let start = moment(control.value).format('YYYY-MM-DD');
          let yearofPassing1 = moment(yearofPassing).format('YYYY-MM-DD');
          error.notValid = this.momentFormMonth(yearofPassing);
          check = moment(start).isSameOrBefore(yearofPassing1, 'month');
          check = !check;
        }
        if (!param) {
          return check ? error : null;
        } else {
          this.detectStartDateCalc(yearofPassing, startDate, endDate, control);
          return null;
        }
      };
    }

    detectStartDateCalc(yearofPassing, startDate, endDate, control) {
      let startCheck;
      let endCheck;
      if (yearofPassing && startDate) {
        let start = moment(startDate).format('YYYY-MM-DD');
        let yearofPassing1 = moment(yearofPassing).format('YYYY-MM-DD');
        // error.notValid = this.momentFormMonth(yearofPassing);
        startCheck = moment(start).isSameOrBefore(yearofPassing1, 'month');
        startCheck = !startCheck;
        startCheck ? control['_parent']['controls'][this.form_startDate].setErrors({notValid: this.momentFormMonth(yearofPassing)}) : control['_parent']['controls'][this.form_startDate].setErrors(null);
      }
      if (yearofPassing && endDate) {
        let end = moment(endDate).format('YYYY-MM-DD');
        let yearofPassing1 = moment(yearofPassing).format('YYYY-MM-DD');
        // error.notValid = this.momentFormMonth(yearofPassing);
        endCheck = moment(end).isSameOrBefore(yearofPassing1, 'month');
        endCheck = !endCheck;
        endCheck ? control['_parent']['controls'][this.form_endDate].setErrors({notValid: this.momentFormMonth(yearofPassing)}) : control['_parent']['controls'][this.form_endDate].setErrors(null);
      }

    }

    startTrue(param) {
      return this.regexValidator({notValid: true}, param);
    }

  formInitialize() {
    this.educationForm = this.fb.group({
      [this.form_educationArray]: this.fb.array([])
    })
  }

  addToEducationArray() {
    if (this.educationForm.valid) {
     return this.getEducationArr.push(this.initEducationArray());
    }
    else{
      this.toast.warning("Please fill all the red highlighted fields to proceed further");
      this.glovbal_validators.validateAllFormArrays(this.educationForm.get([this.form_educationArray]) as FormArray);
    }

  }

  removeEducationArray(i) {
    this.getEducationArr.removeAt(i);
  }

  // Form getters
  // convenience getters for easy access to form fields
  get getEducationArr() { return this.educationForm.get([this.form_educationArray]) as FormArray; }

  setValidations() {
      this.getEducationArr.controls.forEach((element: any, j) => {
      if (element['controls'][this.form_qualification_type]['value'] == 'SSLC') {
        // Disable
        // element['controls'][this.form_qualification_type].disable({ emitEvent: false });
        // Below are dynamically changing data based on education
        element['controls'][this.form_qualification].clearValidators({ emitEvent: false });
        element['controls'][this.form_specialization].clearValidators({ emitEvent: false });
        element['controls'][this.form_collegeName].clearValidators({ emitEvent: false });
        element['controls'][this.form_boardUniversity].clearValidators({ emitEvent: false });

        element['controls'][this.form_collegeName].setValidators([ Validators.required],{ emitEvent: false });
        element['controls'][this.form_boardUniversity].setValidators([ Validators.required],{ emitEvent: false });
        element['controls'][this.form_qualification].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_specialization].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_collegeName].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_boardUniversity].updateValueAndValidity({ emitEvent: false });
        }
      if (element['controls'][this.form_qualification_type]['value'] == 'HSC') {
        // Below are dynamically changing data based on education
        element['controls'][this.form_qualification].clearValidators({ emitEvent: false });
        element['controls'][this.form_specialization].clearValidators({ emitEvent: false });
        element['controls'][this.form_collegeName].clearValidators({ emitEvent: false });
        element['controls'][this.form_boardUniversity].clearValidators({ emitEvent: false });

        element['controls'][this.form_specialization].clearValidators({ emitEvent: false });
        element['controls'][this.form_collegeName].setValidators([ Validators.required],{ emitEvent: false });
        element['controls'][this.form_boardUniversity].setValidators([Validators.required],{ emitEvent: false });

        element['controls'][this.form_qualification].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_specialization].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_collegeName].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_boardUniversity].updateValueAndValidity({ emitEvent: false });
      }
      if (element['controls'][this.form_qualification_type]['value'] == 'Diploma') {
        // Below are dynamically changing data based on education
        element['controls'][this.form_qualification].clearValidators({ emitEvent: false });
        element['controls'][this.form_specialization].clearValidators({ emitEvent: false });
        element['controls'][this.form_collegeName].clearValidators({ emitEvent: false });
        element['controls'][this.form_boardUniversity].clearValidators({ emitEvent: false });

        element['controls'][this.form_specialization].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_collegeName].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_boardUniversity].clearValidators({ emitEvent: false });

        element['controls'][this.form_qualification].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_specialization].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_collegeName].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_boardUniversity].updateValueAndValidity({ emitEvent: false });
      }
      if (element['controls'][this.form_qualification_type]['value'] == 'UG') {
        // Below are dynamically changing data based on education
        element['controls'][this.form_qualification].clearValidators({ emitEvent: false });
        element['controls'][this.form_specialization].clearValidators({ emitEvent: false });
        element['controls'][this.form_collegeName].clearValidators({ emitEvent: false });
        element['controls'][this.form_boardUniversity].clearValidators({ emitEvent: false });

        element['controls'][this.form_qualification].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_specialization].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_collegeName].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_boardUniversity].clearValidators({ emitEvent: false });

        element['controls'][this.form_qualification].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_specialization].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_collegeName].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_boardUniversity].updateValueAndValidity({ emitEvent: false });
      }
      if (element['controls'][this.form_qualification_type]['value'] == 'PG') {
        // Below are dynamically changing data based on education
        element['controls'][this.form_qualification].clearValidators({ emitEvent: false });
        element['controls'][this.form_specialization].clearValidators({ emitEvent: false });
        element['controls'][this.form_collegeName].clearValidators({ emitEvent: false });
        element['controls'][this.form_boardUniversity].clearValidators({ emitEvent: false });

        element['controls'][this.form_qualification].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_specialization].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_collegeName].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_boardUniversity].clearValidators({ emitEvent: false });

        element['controls'][this.form_qualification].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_specialization].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_collegeName].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_boardUniversity].updateValueAndValidity({ emitEvent: false });
      }

      });
    }


  getEducationLevels() {
    this.educationLevels=[
      {education: "SSLC", label: "SSLC"},
      {education: "HSC", label: "HSC"},
      {education: "Diploma", label: "Diploma"},
      {education: "UG", label: "UG"},
      {education: "PG", label: "PG"}
    ];
  }

  getUGSpecialization() {
    const api = {
      level: '',
      discipline: '',
      specification: 'UG'
    };
  }


  getPGSpecialization() {
    const api = {
      level: '',
      discipline: 'UG',
      specification: 'PG'
    };
  }

  getDiplomaDiscipline() {
    const api = {
      level: '',
      discipline: 'Diploma',
      specification: ''
    };
  }

  getUGDiscipline() {
    const api = {
      level: '',
      discipline: 'UG',
      specification: ''
    };
  }

  getPGDiscipline() {
    const api = {
      level: '',
      discipline: 'PG',
      specification: ''
    };

  }

  getDiplomaInstitutes() {
    const api = {
      level: 'Diploma',
      discipline: 'Diploma',
      specification: ''
    };

  }

  getUGandPGInstitutes() {
    const api = {
      level: 'PG',
      discipline: 'PG',
      specification: ''
    };

  }
  navigatePrevNext(type){
    if(this.educationForm.dirty){
      Swal.fire({
        customClass: {
          container: 'swalClass',
        },
        title: 'Are you sure you want to continue?',
        text:'Changes you made will not be saved',
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
  

  ngOnDestroy() {
    this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
    this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
  }

}
