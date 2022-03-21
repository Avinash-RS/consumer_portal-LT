import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-batch-purchase",
  templateUrl: "./batch-purchase.component.html",
  styleUrls: ["./batch-purchase.component.scss"]
})

export class BatchPurchaseComponent implements OnInit {
  hiringPartners = {
    "dispalystatus": false,
    "title": "Hiring Partners",
    "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/hiringPartners_bg.png",
    "description": "L&T EduTech collaborates with 100+ recruiting partners, identify and understand the key talent expectations trending across the globe, design curriculum on right technologies, train learners with industry oriented practice eco-system to place them successfully.",
    "innerArray": [
      {
        "title": "L&T Construction",
        "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/lntcc.png"
      },
      {
        "title": "L&T NXT",
        "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/nxt.png"
      },
      {
        "title": "L&T Technology",
        "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/techservice.png"
      },
      {
        "title": "LTI",
        "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/lti.png"
      },
      {
        "title": "Mind Tree Construction",
        "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/mindtree.png"
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
          "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/packt.png"
        },
        {
          "title": "Pack",
          "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/step.png"
        },
        {
          "title": "Pack",
          "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/wecp.png"
        },
        {
          "title": "Pack",
          "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/amphisoft.png"
        }
      ]
    },
    "subHeading4": {
      "dispalystatus": true,
      "title": "Payment Powered by :",
      "imageurl": "https://lmsassetspremium.lntedutech.com/portalicons/cc.png",
      "Subimageurl": "https://lmsassetspremium.lntedutech.com/portalicons/ccavenue.png",
      "description": ""
    }
  }
  constructor() { 

  }

  ngOnInit() {

  }
}
