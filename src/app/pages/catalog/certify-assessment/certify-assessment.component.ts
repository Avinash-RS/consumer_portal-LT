import { Component, OnInit,Input, ViewChild, TemplateRef, Output, EventEmitter} from '@angular/core';
import { CatalogService } from "../../../services/catalog.service";
import { ToastrService } from 'ngx-toastr';
import { AppConfigService } from 'src/app/utils/app-config.service';
import { APP_CONSTANTS } from "src/app/utils/app-constants.service";
import { UtilityService } from 'src/app/services/utility.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-certify-assessment',
  templateUrl: './certify-assessment.component.html',
  styleUrls: ['./certify-assessment.component.scss']
})
export class CertifyAssessmentComponent implements OnInit {
  panelOpenState = true;
  assessmentList;
  userDetails;
  certifyOpenState = true;
  @Input('competencyData') competencyData: any;
  @Input('areaData') areaData: any;
  @ViewChild('kycmandate', { static: false }) matDialogRef: TemplateRef<any>;
  showdialog: boolean = false;
  @Output ('navBack') navBack = new EventEmitter();
  secretKey = "(!@#Passcode!@#)";
  constructor(private catalogService : CatalogService, public toast: ToastrService,
              private appconfig: AppConfigService, private appConfig: AppConfigService,
              private util: UtilityService,private dialog: MatDialog,public commonService: CommonService,
              ) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(this.appconfig.getLocalStorage('userDetails'));

    this.getAssesments();
  }

  getAssesments(){
    var params = {
      "competencyId":this.competencyData.cid,
      "productType":"assessment"
  }
    this.catalogService.getAssesments(params).subscribe((response:any)=>{
      if (response.data.length > 0) {
       this.assessmentList = response.data
       const element = document.getElementById('certification');
       const y = element.getBoundingClientRect().top + window.pageYOffset -70;
       window.scrollTo({top: y, behavior: 'smooth'});
      }

    })
  }
  dialogSetup():boolean{
    if (this.showdialog) {
      const valdat = this.dialog.open(this.matDialogRef, {
        width: '400px',
        height: '300px',
        autoFocus: true,
        closeOnNavigation: true,
        disableClose: true,
        panelClass: 'popupModalContainerForForms'
      });
      return false
    }
    return true
  }

  openMandate() {
    // if (this.appconfig.getSessionStorage('token')) {

    // }
    // else {
    //   this.showdialog = false;
    // }

  }

  addCart(isLevel,id1,id2,from,freeData?) {
    console.log(freeData)
    if (this.userDetails) {
      var productType = this.competencyData.productType ? this.competencyData?.productType :'assessment';
      var params = {
        ????"isLevel":isLevel,
  ????????    "levelId":id1,
  ????????    "userId":this.userDetails.userId,
  ????????    "assessmentId":id2,
          "competencyId":this.competencyData.cid,
          "productType" : productType,
      }
      var checkParam = {
        "userId":this.userDetails.userId,
        "assessmentId":id2
      }
      const data = {
        "noofFields": "44",
        "email": this.userDetails.email ? this.userDetails.email : null
      }

      let freeTest:any = {}
      if(freeData)
      {freeTest.user_id = this.userDetails.userId;
      freeTest.cart = [];
      // this.cartList.forEach(cartItem => {
        freeTest.cart.push(
          {
             assessmentId: freeData.cid,
          }
        )}

      this.commonService.getProfilePercentage(data).subscribe((result: any) => {
        if (result?.success) {
          //let profilePercentage = result.data[0].profilePercentage;
          let KYCFlag = result.data[0].KYCMandFlag ? result.data[0].KYCMandFlag : 0;
          if (KYCFlag == 0) {
            this.showdialog = true
          }else{
            this.showdialog = false

            // this.catalogService.checkassessment(checkParam).subscribe((checkData:any)=>{
      //   if(checkData.success){

          this.catalogService.addToCart(params).subscribe((response:any) =>{
            if(response.success) {
              if(freeData){
                this.toast.success("Assessment order created");
              }else
              {this.toast.success("Added to cart");}
              this.util.cartSubject.next(true);
              if(freeData){
                freeTest.cartId = response?.data[0].cartId;
                this.catalogService.createOrder(freeTest).subscribe((data: any) => {
                  this.appconfig.routeNavigationWithQueryParam("cart/success",{ orderId: btoa(data.orderId) });
                })
              }else{
              if (from == 'buy') {
                this.appConfig.routeNavigation('cart/purchase');
              }
            }
            } else {
              this.toast.warning(response.message)
            }
          })
        // }else{
        //   this.toast.error("Assessment already purchased");
        // }
      // })

          }
        }
        else {
          this.showdialog = true;
        }

         this.dialogSetup();
      });




    } else {
      var productType = this.competencyData.productType ? this.competencyData?.productType :'assessment';
      params = {
        ????"isLevel":isLevel,
  ????????    "levelId":id1,
  ????????    "userId":'',
  ????????    "assessmentId":id2,
          "competencyId":this.competencyData.cid,
          "productType" :productType
      }
      this.util.setValue(params);
      this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, {fromPage: this.commonService.encrypt('0',this.secretKey) });
    }
  }

  // openCart() {
  //   if (this.userDetails) {
  //   this.appConfig.routeNavigation('cart/purchase');
  //   } else {
  //     this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, {fromPage: '0'});
  //   }
  // }
  back(){
    this.navBack.emit(false);
  }

}
