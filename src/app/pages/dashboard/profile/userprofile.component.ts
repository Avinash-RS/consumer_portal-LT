import { Component, OnInit, Input, ViewChild, TemplateRef, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from "@angular/material/dialog";
import { environment } from '@env/environment';
import { AppConfigService } from "src/app/utils/app-config.service";
import { GlobalValidatorsService } from 'src/app/validators/global-validators.service';
import { UtilityService } from 'src/app/services/utility.service';
import * as bcrypt from 'bcryptjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { trigger, style, animate, transition } from '@angular/animations';
import Swal from 'sweetalert2';

@Component({
  selector: "app-userprofile",
  templateUrl: "./userprofile.component.html",
  styleUrls: ["./userprofile.component.scss"],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({opacity: 0}),
          animate('900ms', style({opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('300ms', style({opacity: 0}))
        ])
      ]
    )
  ],
})

export class UserprofileComponent implements OnInit {
  @ViewChild('certificateTemplate', { static: false }) certificateLayout: TemplateRef<any>;
  blobToken: string = environment.blobKey;
  paramvalue={};
  DataofCertificate;
  isCertificate = true;
  certificateValue;
  selection;
  skillList:any;
  skillNames=[]
  certificationList=[]
  skillScores=[]
  selectionTypes = [
    {
      'title': 'Profile',
      "tabname": 'profile',
      'Active': true
    },
    // {
    //   'title': 'KYC Information',
    //   "tabname": 'KYC',
    //   'Active': false,
    //   'child':[
    //     {'title':'Personal Details','tab':'Personal','Active':true},
    //     {'title':'Contact Details','tab':'Contact','Active':false},
    //     {'title':'Passport & Other Identity Proof','tab':'Passport','Active':false},
    //     {'title':'Education Details','tab':'Education','Active':false},
    //     // {'title':'Questionnaire','tab':'Questionnaire','Active':false},
    //     {'title':'Preview','tab':'Preview','Active':false},
    //   ]
    // },
    // {
    //   'title': 'My Skill Zone',
    //   "tabname": 'skill',
    //   'Active': false
    // },
    {
      'title': 'Account Settings',
      "tabname": 'account',
      'Active': false
    },
    {
      'title': 'Purchase History',
      "tabname": 'history',
      'Active': false
    },
    // {
    //   'title': 'Payment Methods',
    //   "tabname": 'payment',
    //   'Active': false
    // },
    {
      'title': 'Certificate',
      "tabname": 'certificate',
      'Active': false
    },
    // {
    //   'title': 'Close Account',
    //   "tabname": 'close',
    //   'Active': false
    // },
    
  ]
  userDetails: any;
  purchaseList = [];
  imageURL: any;
  addressEntryForm: FormGroup;
  addBadgeForm: FormGroup;
  accountSettingsForm: FormGroup;
  profileData;
  value = 50;
  value1 = 64;
  value2 = 79;
  @ViewChild('imageInput') imageInput;
  closeAccount: FormGroup;
  @ViewChild('fileUpload')
  fileUpload: ElementRef 
  inputFileName: string 
  @Input()
  files: File[] = []
  @Input()
  multiple;
  openKYCPannel = false;
  selectedKycTab:string ="Personal";
  profilePercentage:any = 0;
  maxDOBDate = new Date();
  minDateValue = new Date();
  secretKey = "(!@#Passcode!@#)";
  minDate: Date;
  maxDate: number;
  currpasshide = true;
  newpasshide = true;
  conpasshide = true;
  hasChange: boolean = false;
  constructor(public commonService: CommonService,
    public route: ActivatedRoute,
    private router:Router,
    public toast: ToastrService,
    private dialog: MatDialog, 
    private fb: FormBuilder,
    private appconfig: AppConfigService,
    private gv: GlobalValidatorsService,
    private sanitizer: DomSanitizer,
    private util: UtilityService) {
      this.route.queryParams.subscribe( params => {
        if(params.tab){
          this.paramvalue['title'] = params.tab
          this.selection = 'skill'
          this.selectTypes(this.paramvalue)
        }
        if(params.tabtype){
          this.selection = params.tabtype;
          if(this.selection == 'account'){
            this.selectTypes({title:'Account Settings'});
          }
          else if(this.selection == 'history'){
            this.selectTypes({title:'Purchase History'});
          }
          else if(this.selection == 'payment'){
            this.selectTypes({title:'Payment Methods'});
          }
          else if(this.selection == 'certificate'){
            this.selectTypes({title:'Certificate'});
          }
        }
      })
  }

  ngOnInit() {
    this.userDetails = JSON.parse(this.appconfig.getLocalStorage('userDetails'));
    this.getProfile();
    this.profileFormInitialize();
    this.accountSettingsFormInitialize();
    this.closeAccountFormInitialize();
    this.getpurchasehistory();
    this.getSkillChartData();
    this.selectedKycTab = "Personal";
    // this.tabchanged();
    // this.getProfilePercentage();
    // this.triggerProfilepercentage();
    this.navigateParentTab();
    this.setdob();
  }

  setdob() {
    const currentDate = new Date();
    this.minDateValue = new Date(currentDate.getFullYear() - 72, currentDate.getMonth() , currentDate.getDate());
    this.maxDOBDate = new Date(currentDate.getFullYear()  - 18, currentDate.getMonth(), currentDate.getDate());
  }

  navigateParentTab(){
    this.util.ParentkyctabSubject.subscribe((result:any)=>{
      this.selection = "Profile";
      var obj ={title:'Profile'};
      this.openKYCPannel = false;
      this.selectTypes(obj);
      this.selectedKycTab = "Personal";
      // this.ChangeKycTabs("Personal");
    })
  }
  selectTypes(value) {
    this.selectionTypes.forEach((data) => {
      data.Active = false;
      if (data.title == value.title) {
        data.Active = true;
      }
    })
  }
  getSkillChartData(){
    // this.userDetails.email
    let param = {
      "email": this.userDetails.email
    }
    this.commonService.getPortfolioDetails(param).subscribe((rdata:any)=>{
    this.skillList = rdata && rdata.data && rdata.data[0] && rdata.data[0].skillList ? rdata.data[0].skillList : [];
    this.certificationList = rdata && rdata.data && rdata.data[0] && rdata.data[0].certificationList ? rdata.data[0].certificationList : [];
    this.skillNames=[];
    this.skillScores=[];
    this.skillList.forEach(item => {
        this.skillNames.push(item.skillname);
        this.skillScores.push(item.score);
    });
    })
  }
  getprofileImgUpdate(fileInput: any) {
    if (fileInput && fileInput.target && fileInput.target.files && fileInput.target.files[0]) {
      const filePath = fileInput.target.files[0].name;
      const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      if (!allowedExtensions.exec(filePath)) {
        this.toast.warning('Please upload file having extensions (.jpg .jpeg .png)');
        if (this.imageInput) {
          this.imageInput.nativeElement.value = '';
        }
        return false;
      }
      else {
        const imageView = fileInput.target.files[0];
        const formData = new FormData();
        formData.append('image', imageView);
        this.commonService.getprofileImgUpdate(formData).subscribe((data: any) => {
          if (data.data.path) {
            this.imageURL = data.data.url;
            if (this.imageURL) {
              this.addressEntryForm.controls.image.patchValue(this.imageURL);
              this.toast.success(data.message);
            }
          }
          else {
            this.toast.warning('Something went wrong');
          }
        });
        if (this.imageInput) {
          this.imageInput.nativeElement.value = '';
        }
      }
    }
  }

  accountSettingsFormInitialize() {
    this.accountSettingsForm = this.fb.group({
      cp_currentPassword: ['', [Validators.required, this.gv.passwordRegex(), Validators.minLength(8), Validators.maxLength(32)]],
      password: ['', [Validators.required, this.gv.passwordRegex(), Validators.minLength(8), Validators.maxLength(32)]],
      password2: ['', [Validators.required]],
    }, { validators: this.gv.passwordMatcher() })
  }
  closeAccountFormInitialize() {
    this.closeAccount = this.fb.group({

      endPassword: ['', [Validators.required]],
    })
  }

  profileFormInitialize() {
    this.addressEntryForm = this.fb.group({
      userId: ['', [Validators.required]],
      firstname: ['', [Validators.required, this.gv.alphaNum30()]],
      lastname: ['', [Validators.required, this.gv.alphaNum30()]],
      email: ['', [Validators.required, this.gv.email()]],
      mobile: ['', [Validators.required, this.gv.mobile()]],
      // location: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      image: ['']
    });
    this.addressEntryForm.controls.email.patchValue(this.userDetails.emailId);
  }

  profileSubmit() {
    if(this.hasChange) {
      this.addressEntryForm.controls.userId.patchValue(this.userDetails.userId);
      // console.log(this.addressEntryForm);
       // return;
       if (this.addressEntryForm.valid) {
         this.addressEntryForm.value.email = this.userDetails.email;
         this.commonService.profileUpdate(this.addressEntryForm.value).subscribe((data: any) => {
           if (data.success) {
             this.userDetails.firstname = this.addressEntryForm.value.firstname;
             this.userDetails.lastname = this.addressEntryForm.value.lastname;
             this.appconfig.setLocalStorage('userDetails', JSON.stringify(this.userDetails));
             //this.toast.success(data.message);
             this.toast.success("Profile saved successfully");
             // this.getProfilePercentage();
             // this.selection = 'KYC';
             if (this.imageURL) {
               this.appconfig.setLocalStorage('profileImage', this.imageURL);
               this.util.headerSubject.next(true);
             }
           }
           else {
             this.toast.warning('Something went Wrong');
           }
         });
       }
       else {
         this.toast.error('Please fill in all required fields');
       }
    }
    else {
      this.toast.warning("No changes to save");
    }
    
  }
  triggerProfilepercentage(){
    this.util.percentageSubject.subscribe((result:any)=>{
      if(result){
        this.getProfilePercentage();
      }
    })
  }
getProfilePercentage(){
  const data = {
    "noofFields":"44",
    "email" : this.userDetails.email ? this.userDetails.email :null
  }
  this.commonService.getProfilePercentage(data).subscribe((result:any)=>{
    if(result?.success){
       this.profilePercentage =  result.data[0].profilePercentage;
    }
    else{
      this.profilePercentage = 0;
    }
  })
}
  getProfile() {
    this.commonService.getProfile(this.userDetails.userId).subscribe((response: any) => {
      if (response.success) {
        this.profileData = response.data?.data
        this.addressEntryForm.patchValue({
          firstname: this.profileData?.firstname,
          lastname: this.profileData?.lastname,
          email: this.profileData?.email,
          mobile: this.profileData?.profile?.phone,
          dob: this.profileData?.profile?.dateOfBirth,
          gender: this.profileData?.profile?.gender,
          image: this.profileData?.profile?.profileImage,
        });
        this.imageURL = this.profileData?.profile?.profileImage;
        this.checkFormChanges();
      }
    })
    // password: ['', [Validators.required, this.gv.passwordRegex(), Validators.minLength(8), Validators.maxLength(32)]],
  }
  checkFormChanges() {
    const initialValue = this.addressEntryForm.value;
    this.addressEntryForm.valueChanges.subscribe(value =>{
      this.hasChange = Object.keys(initialValue).some(key => this.addressEntryForm.value[key] != initialValue[key]);
    });
  }
  get firstname() {
    return this.addressEntryForm.get('firstname');
  }
  get lastname() {
    return this.addressEntryForm.get('lastname');
  }
  get email() {
    return this.addressEntryForm.get('email');
  }
  get mobile() {
    return this.addressEntryForm.get('mobile');
  }
  // get password() {
  //   return this.addressEntryForm.get('password');
  // }
  get image() {
    return this.addressEntryForm.get('image');
  }
  get cp_currentPassword() {
    return this.accountSettingsForm.get('cp_currentPassword');
  }
  get password() {
    return this.accountSettingsForm.get('password');
  }
  get password2() {
    return this.accountSettingsForm.get('password2');
  }
  get endPassword() {
    return this.closeAccount.get('endPassword');
  }

  getpurchasehistory() {
    let param = { "userId": this.userDetails.userId, "email": this.userDetails.email, 'type': 'All' }
    this.commonService.getmyAssesments(param).subscribe((rdata: any) => {
      if (rdata.success) {
        this.purchaseList = rdata.data;
      } else {
        this.toast.warning('Something went Wrong');
      }
    });
  }
  deactivateaccount() {
    Swal.fire({
      customClass: {
        container: 'swalClass',
      },
      title: 'You are about to close this account!!!  Are you sure?',
      showCancelButton: true,
      confirmButtonColor: '#ffffff',
      cancelButtonColor: '#ffffff',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if(result.isConfirmed) {
        const encryptPass = this.commonService.encrypt(this.closeAccount.get('endPassword').value,this.secretKey)
        let param = {
          "email": this.userDetails.email,
          "password": encryptPass,
        }
        this.commonService.deactivateAccount(param).subscribe((data: any) => {
          if (data.success) {
            this.toast.success(data.message);
            this.commonService.logout();
          } else {
            this.toast.error(data.message);
            this.closeAccountFormInitialize();
          }
        });
      }
    });
  }

  changePassword() {
    if (this.accountSettingsForm.valid) {
      // const salt = bcrypt.genSaltSync(10);
      // const pass = bcrypt.hashSync(this.accountSettingsForm.value.password, salt);
      const encryptPass = this.commonService.encrypt(this.accountSettingsForm.value.password,this.secretKey);
      const currentencryptPass = this.commonService.encrypt(this.accountSettingsForm.value.cp_currentPassword,this.secretKey);
      let data = { "email": this.userDetails.email, "newpassword": encryptPass, "currentpassword": currentencryptPass}
      this.commonService.updatePassword(data).subscribe((resp: any) => {
        if (resp.success) {
          this.toast.success(resp.message)
          this.commonService.logout();
        } else {
          this.toast.error(resp.message)
        }
      })
    }
  }

  addBadge(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '70%',
      height: '90%',
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'addNewBadgeContainer'
    });
  }

  onClick(event) {
    if (this.fileUpload)
      this.fileUpload.nativeElement.click()
  }
 

  onFileSelected(event) {
    let files = event.dataTransfer ? event.dataTransfer.files : event.target.files; 
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
 
      if (this.validate(file)) { 
        file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i]))); 
        if (!this.isMultiple()) {
          this.files = []
        }
        this.files.push(files[i]); 
      } 
    }
  }

  removeFile(event, file) {
    let ix
    if (this.files && -1 !== (ix = this.files.indexOf(file))) {
      this.files.splice(ix, 1)
      this.clearInputElement()
    }
  }

  validate(file: File) {
    for (const f of this.files) {
      if (f.name === file.name
        && f.lastModified === file.lastModified
        && f.size === f.size
        && f.type === f.type
      ) {
        return false
      }
    }
    return true;
  }

  // tslint:disable-next-line:typedef
  getCertificates() {
    this.commonService.getProfileCertificate(this.userDetails.userId).subscribe((result: any) => {
      if (result.success) {
        this.isCertificate = true;
        this.DataofCertificate = result.data;
        if (this.DataofCertificate?.length == 0) {
          this.isCertificate = false;
        }
      } else {
        this.isCertificate = false;
      }
    },
    err => {
      this.isCertificate = false;
    });
  }

  viewCertificate(value){
    this.certificateValue = value;
    const valdat = this.dialog.open(this.certificateLayout, {
      width: '1150px',
      height: '85%',
      autoFocus: true,
      closeOnNavigation: true,
      panelClass: 'certificationContainer',
      data: value,
    });
    return false;
  }

//   // tslint:disable-next-line:typedef
  downloadCertificate(data) {
    if (data) {
      var content = data;
    } else {
      content = this.certificateValue;
    }
    var element = document.getElementById('content');
    (document.getElementById('userID') as HTMLInputElement).innerHTML = content.firstName + '&nbsp' + content.lastName;
    (document.getElementById('courseID') as HTMLInputElement).innerHTML = content.courseName;
    var opt = {
      filename: 'myfile.pdf',
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    pdf().from(element).set(opt).toPdf().get('pdf').then(function (pdf) {
    }, (err) => {
    }).save();
  }
  
  clearInputElement() {
      this.fileUpload.nativeElement.value = '';
    }
  
  isMultiple(): boolean {
      return this.multiple;
    }
}


  // ChangeKycTabs(selectedTab){
  //   this.selectionTypes[1].child.forEach(element=>{
  //     if(element.tab == selectedTab){
  //       element.Active = true;
  //     }
  //     else{
  //       element.Active = false;
  //     }
  //   });
  //   this.selectedKycTab = selectedTab;
  // }

  // tabchanged(){
  //   this.util.kyctabSubject.subscribe((data:string)=>{
  //     this.ChangeKycTabs(data);
  //   })
  // }
