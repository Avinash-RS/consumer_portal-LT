import { Component, OnInit,Input} from '@angular/core';
import { CatalogService } from "../../../services/catalog.service";
import { ToastrService } from 'ngx-toastr';
import { AppConfigService } from 'src/app/utils/app-config.service';
import { APP_CONSTANTS } from "src/app/utils/app-constants.service";
import { UtilityService } from 'src/app/services/utility.service';

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

  constructor(private catalogService : CatalogService, public toast: ToastrService,
              private appconfig: AppConfigService, private appConfig: AppConfigService,
              private util: UtilityService
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
