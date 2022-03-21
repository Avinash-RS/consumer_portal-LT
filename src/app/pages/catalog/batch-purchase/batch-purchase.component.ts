import { Component, OnInit } from "@angular/core";
import { AppConfigService } from 'src/app/utils/app-config.service';
import { ActivatedRoute } from '@angular/router';
import { CatalogService } from 'src/app/services/catalog.service';

@Component({
  selector: "app-batch-purchase",
  templateUrl: "./batch-purchase.component.html",
  styleUrls: ["./batch-purchase.component.scss"]
})

export class BatchPurchaseComponent implements OnInit {
  userDetails;
  domainId;
  areaId;
  productType;
  abouCourseData:any;
  courseData;
  bannerContent;
  nocard:boolean = true;
  selectedBatchId:string = '';
  hiringPartners = {
    "dispalystatus": false,
    "title": "Hiring Partners",
    "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/hiringpartners-bg.webp",
    "description": "L&T EduTech collaborates with 100+ recruiting partners, identify and understand the key talent expectations trending across the globe, design curriculum on right technologies, train learners with industry oriented practice eco-system to place them successfully.",
    "innerArray": [
      {
        "title": "L&T Construction",
        "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/lntcc.webp"
      },
      {
        "title": "L&T NXT",
        "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/nxt.webp"
      },
      {
        "title": "L&T Technology",
        "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/techservice.webp"
      },
      {
        "title": "LTI",
        "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/lti.webp"
      },
      {
        "title": "Mind Tree Construction",
        "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/mindtree.webp"
      }
    ],
    "subHeading1": {
      "dispalystatus": true,
      "title": "Programs",
      "imageurl": "",
      "description": "",
      "innerArray": [
        "Full Stack .NET Application Development Cyber Security",
        "Python and Data Management",
        "MEAN Application Development"
      ]
    },
    "subHeading2": {
      "dispalystatus": true,
      "title": "Courses",
      "imageurl": "",
      "description": "",
      "innerArray": [
        "Modern Web Design",
        "Angular 7",
        "Complete Node JS",
        "MongoDB",
        "Complete Java",
        "MySQL",
        "Modern Web Design",
        "Spring Boot",
        "Complete C#",
        "ASP.NET",
        "Data Science and Machine Learning with Python",
        "Data Visualization with PowerBI",
        "Restful Services with ASP.NET",
        "Web Services with Java"
      ]
    },
    "subHeading3": {
      "dispalystatus": true,
      "title": "Our Partners :",
      "imageurl": "",
      "description": "students can reach us at – call: 000-000-0000 email: xyz@lntedutech.com",
      "innerArray": [
        {
          "title": "Pack",
          "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/packt.webp"
        },
        {
          "title": "Pack",
          "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/step.webp"
        },
        {
          "title": "Pack",
          "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/wecp.webp"
        },
        {
          "title": "Pack",
          "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/amphisoft.webp"
        }
      ]
    },
    "subHeading4": {
      "dispalystatus": true,
      "title": "Payment Powered by :",
      "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/cc.webp",
      "Subimageurl": "https://lmsassetspremium.lntedutech.com/portalicons/ccavenue.webp",
      "description": ""
    }
  }
  constructor(private appconfig: AppConfigService, private route:ActivatedRoute, private catalogService : CatalogService) { 

  }

  ngOnInit() {
    this.userDetails = JSON.parse(this.appconfig.getSessionStorage('userDetails'));
    this.route.queryParams.subscribe(params => {
      this.domainId = atob(params.selectedTab);
      this.areaId = atob(params.id);
      this.productType = atob(params.productType);
      this.getAbouCourse();
    });
  }

  getAbouCourse() {
    var params = {
      "competencyId":this.areaId,
      "productType":"course"
    }
    this.catalogService.getAssesments(params).subscribe((response:any)=>{
      if (response.success) { 
        if(response.data && response.data.length > 0 && response.data[0].assessmentData && response.data[0].assessmentData.length){
          this.abouCourseData = response.data[0];
          this.bannerContent = this.abouCourseData.assessmentData[0]
          this.courseData = this.abouCourseData.assessmentData[0].batchDetails;
          this.nocard = false;
          this.courseData.forEach((e) => {
            this.getTimer(e);
          });
        }
        else {
          this.abouCourseData = [];
          this.nocard = true;
        }
      }
      else {
        this.abouCourseData = [];
        this.nocard = true;
      }
    })
  }

  getTimer(filobject) {
    var countDownDate = new Date(filobject.enrollmentClosesOn).getTime();

    var x = setInterval(function() {

      var now = new Date().getTime();
        
      var distance = countDownDate - now;
      filobject.timer = {}
      filobject.timer.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      filobject.timer.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      filobject.timer.mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      filobject.timer.secs = Math.floor((distance % (1000 * 60)) / 1000);
      filobject.timer.isExpired = false;

      if (distance < 0) {
        clearInterval(x);    
        filobject.timer = {}
        filobject.timer.isExpired = true;
      }
    }, 1000);
  }

  getBatchId(ele) {
    this.selectedBatchId = ele.batchId;
  }
}
