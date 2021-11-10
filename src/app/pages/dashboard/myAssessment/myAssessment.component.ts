import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { CommonService } from "src/app/services/common.service";
import { AppConfigService } from "src/app/utils/app-config.service";
import { APP_CONSTANTS } from "src/app/utils/app-constants.service";
import { BookSlotComponent } from '../../bookSlot/bookSlot.component';
import { environment } from '@env/environment';

@Component({
  selector: "app-myAssessment",
  templateUrl: "./myAssessment.component.html",
  styleUrls: ["./myAssessment.component.scss"]
})

export class MyAssessmentComponent implements OnInit {
  showInfoPop:boolean = true
  tabList:any = [
    {
      tabName:'All',
      isActive:true
    },
    {
      tabName:'Ongoing',
      isActive:false
    },
    {
      tabName:'Completed',
      isActive:false
    }
  ]
  assessmentList = [];
  userDetails: any;
  profilePercentage:any = 0;
  
  constructor(
    private commonServ: CommonService,
    private appconfig: AppConfigService,
    private dialog: MatDialog,
  ) { 
    this.userDetails = JSON.parse(this.appconfig.getSessionStorage('userDetails'));
  }

  ngOnInit() {
    this.getmyAssesments(this.tabList[0]);
    this.getProfilePercentage();
  }

  getmyAssesments(typeData){
    let param = {"userId": this.userDetails.userId, "email": this.userDetails.email, 'type':typeData.tabName}
    this.commonServ.getmyAssesments(param).subscribe((rdata:any)=>{
        rdata.data.forEach(element => {
          element.assessmentDetails.testTypes.forEach(exams => {
            if(exams.bookaslotstatus){
              element.assessmentDetails.showExamBtn = true;
            }
          });
        });

        this.tabList.forEach(element => {
        element.isActive = false
      });
      this.assessmentList = rdata.data;
      typeData.isActive = true;
    })
  }

  toCatalogue() {
    this.appconfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.home, { fromPage: "viewAll", selectedTab: 'All' });
  }

  uapRedirect(assessmentId){
    this.userDetails=JSON.parse(this.appconfig.getSessionStorage('userDetails'))
    // var jsonData={
    //   "assessmentName":assessmentId,
    //   "email":this.userDetails.email
    // }
    // this.commonServ.gototest(jsonData).subscribe((rdata:any)=>{
    //   if(rdata&&rdata.success){
        window.location.href = environment.uap+"/landing/assessment/"+assessmentId+"?token="+this.userDetails.email+"&appType=1";
    //   }
    // });
  }
  bookSlot(itemdata, index, reSchedule){
    let dialogData = {
      cid: itemdata.assessmentDetails.cid,
      assesmentName: itemdata.cart.assessmentName,
      competencyName: itemdata.cart.competencyName,
      levelName: itemdata.cart.levelName,
      orderNo: itemdata.order_id,
      callingFrom:'MAP',
      selectedindex:index,
      reSchedule:reSchedule
    }
    this.dialog.open(BookSlotComponent, {
      width: '65%',
      height: '65%',
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'bookSlotContainer',
      data: dialogData,
    }).afterClosed().subscribe(()=>{
      this.getmyAssesments(this.tabList[0]);
    });
  }

  getProfilePercentage(){
    const data = {
      "noofFields":"15",
      "email" : this.userDetails.email ? this.userDetails.email :null
    }
    this.commonServ.getProfilePercentage(data).subscribe((result:any)=>{
      if(result.success){
         this.profilePercentage =  result.data[0].profilePercentage;
      }
      else{
        this.profilePercentage = 0;
      }
    })
  }

}
