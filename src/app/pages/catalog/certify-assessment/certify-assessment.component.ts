import { Component, OnInit,Input, ViewChild, TemplateRef} from '@angular/core';
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

  constructor(private catalogService : CatalogService, public toast: ToastrService,
              private appconfig: AppConfigService, private appConfig: AppConfigService,
              private util: UtilityService,private dialog: MatDialog,public commonService: CommonService,
              ) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(this.appconfig.getSessionStorage('userDetails'));

    this.getAssesments();
  }

  getAssesments(){
    var params = {
      "competencyId":this.competencyData.cid
  }
    this.catalogService.getAssesments(params).subscribe((response:any)=>{
      if (response.data.length > 0) {
       this.assessmentList = response.data
      }

    })
  }
  dialogSetup():boolean{
    if (this.showdialog) {
      const valdat = this.dialog.open(this.matDialogRef, {
        width: '400px',
        height: '400px',
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

  addCart(isLevel,id1,id2,from) {
    if (this.userDetails) {
      var params = {
          "isLevel":isLevel,
          "levelId":id1,
          "userId":this.userDetails.userId,
          "assessmentId":id2,
          "competencyId":this.competencyData.cid
      }
      var checkParam = {
        "userId":this.userDetails.userId,
        "assessmentId":id2
      }
      const data = {
        "noofFields": "15",
        "email": this.userDetails.email ? this.userDetails.email : null
      }
      this.commonService.getProfilePercentage(data).subscribe((result: any) => {
        if (result.success) {
          let profilePercentage = result.data[0].profilePercentage;
          if (profilePercentage <= 50) {
            this.showdialog = true
          }else{
            this.showdialog = false

            // this.catalogService.checkassessment(checkParam).subscribe((checkData:any)=>{
      //   if(checkData.success){
          this.catalogService.addToCart(params).subscribe((response:any) =>{
            if(response.success) {
              this.toast.success("Assessment added to cart");
              this.util.cartSubject.next(true);
              if (from == 'buy') {
                this.appConfig.routeNavigation('cart/purchase');
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
      params = {
          "isLevel":isLevel,
          "levelId":id1,
          "userId":'',
          "assessmentId":id2,
          "competencyId":this.competencyData.cid
      }
      this.util.setValue(params);
      this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, {fromPage: '0'});
    }
  }

  // openCart() {
  //   if (this.userDetails) {
  //   this.appConfig.routeNavigation('cart/purchase');
  //   } else {
  //     this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, {fromPage: '0'});
  //   }
  // }

}
