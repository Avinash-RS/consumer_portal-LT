import { Component, OnInit, HostListener, ViewChild, TemplateRef } from '@angular/core';
import { Router } from "@angular/router"
import {ActivatedRoute} from '@angular/router';
import { AppConfigService } from 'src/app/utils/app-config.service';
import { CatalogService } from "../../../services/catalog.service";
import { environment } from '@env/environment';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { UtilityService } from 'src/app/services/utility.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-about-assessment',
  templateUrl: './about-assessment.component.html',
  styleUrls: ['./about-assessment.component.scss']
})
export class AboutAssessmentComponent implements OnInit {
  selectedIndex = 0;
  TopicsOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    margin: 30,
    navText: ["<i class='icon-LeftArrow'></i>", "<i class='icon-RightArrow'></i>"],
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      992: {
        items: 2
      }
    }
  }
  expertOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    margin: 30,
    navText: ["<i class='icon-LeftArrow'></i>", "<i class='icon-RightArrow'></i>"],
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      992: {
        items: 3
      }
    }
  }
  //
  relatedList: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    margin: 30,
    navText: ["<i class='icon-Back'></i>", "<i class='icon-right-next'></i>"],
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      700: {
        items: 3,
        slideBy: 3
      },
      1024: {
        items: 4,
        slideBy: 4
      }
    }
  }
  howItWorks:any
  isReadMore = true
  areaId;
  pageNumber = 0;
  aboutArea;
  domainId;
  // isSticky: boolean = false;
  blobToken: string = environment.blobKey;
  bannerImage;
  showAssesment = false;
  competencyList;
  competencyData;
  totalAssessmentCount: any;
  productType:string =  "assessment";
  abouCourseData:any;
  userDetails;
  nocard:boolean = true;
  defaultDiv:boolean = true;
  @ViewChild('kycmandate', { static: false }) matDialogRef: TemplateRef<any>;
  backgroundImageUrl: any;
  btoaId:any;
  btoaAll = btoa('All');
  btoaproductType = btoa('assessment');
  constructor(private router: Router, private catalogService : CatalogService,private route:ActivatedRoute,private appconfig: AppConfigService,
    private commonService : CommonService,public toast: ToastrService ,private util: UtilityService,private dialog: MatDialog,
    ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
   }
  public destroyed = new Subject<any>();
  contactForm: FormGroup;
  OurPartners =  {
    "sectionId" : 11,
    "dispalystatus" : true,
    "title" : "Hiring Partners",
    "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/hiringPartners_bg.png",
    "description" : "L&T EduTech collaborates with 100+ recruiting partners, identify and understand the key talent expectations trending across the globe, design curriculum on right technologies, train learners with industry oriented practice eco-system to place them successfully.",
    "innerArray" : [ 
        {
            "title" : "L&T Construction",
            "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/lntcc.png"
        }, 
        {
            "title" : "L&T NXT",
            "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/nxt.png"
        }, 
        {
            "title" : "L&T Technology",
            "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/techservice.png"
        }, 
        {
            "title" : "LTI",
            "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/lti.png"
        }, 
        {
            "title" : "Mind Tree Construction",
            "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/mindtree.png"
        }
    ],
    "subHeading1" : {
        "dispalystatus" : true,
        "title" : "Programs",
        "imageurl" : "",
        "description" : "",
        "innerArray" : [ 
            "Full Stack .NET Application Development Cyber Security", 
            "Python and Data Management", 
            "MEAN Application Development"
        ]
    },
    "subHeading2" : {
        "dispalystatus" : true,
        "title" : "Courses",
        "imageurl" : "",
        "description" : "",
        "innerArray" : [ 
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
    "subHeading3" : {
        "dispalystatus" : true,
        "title" : "Our Partners :",
        "imageurl" : "",
        "description" : "students can reach us at – call: 000-000-0000 email: xyz@lntedutech.com",
        "innerArray" : [ 
            {
                "title" : "Pack",
                "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/packt.png"
            }, 
            {
                "title" : "Pack",
                "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/step.png"
            }, 
            {
                "title" : "Pack",
                "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/wecp.png"
            }, 
            {
                "title" : "Pack",
                "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/amphisoft.png"
            }
        ]
    },
    "subHeading4" : {
        "dispalystatus" : true,
        "title" : "Payment Powered by :",
        "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/cc.png",
        "Subimageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/ccavenue.png",
        "description" : ""
    }
}
 
  relatedassesment =  [ 
    {
        "title" : "Aptitude Skill Assessment",
        "rating" : [ 
            1, 
            2, 
            3, 
            4
        ],
        "NoOfAssessment" : "2",
        "level" : "Beginner",
        "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/apptitude.png"
    }, 
    {
        "title" : "Communication Skills",
        "rating" : [ 
            1, 
            2, 
            3, 
            4
        ],
        "NoOfAssessment" : "2",
        "level" : "Intermediate",
        "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/communication.png"
    }, 
    {
        "title" : "Behavioural Personal Profile",
        "rating" : [ 
            1, 
            2, 
            3, 
            4
        ],
        "NoOfAssessment" : "2",
        "level" : "Advanced",
        "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/behavioral.png"
    }, 
    {
        "title" : "Assessment for IT learning",
        "rating" : [ 
            1, 
            2, 
            3, 
            4
        ],
        "NoOfAssessment" : "2",
        "level" : "Beginner",
        "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/assessmentit.png"
    }
]
relatedcourses = [
  {
    "title" : "Full Stack .NET Application Development",
    "date" : "20-01-2022",
    "duration" : "4 months",
    "rating" : [ 
        1, 
        2, 
        3, 
        4, 
        5
    ],
    "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/fullstack.png"
}, 
{
    "title" : "Python and Data Management",
    "date" : "20-01-2022",
    "duration" : "4 months",
    "rating" : [ 
        1, 
        2, 
        3, 
        4
    ],
    "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/pycours.png"
}, 
{
    "title" : "Cyber Security",
    "date" : "20-01-2022",
    "duration" : "4 months",
    "rating" : [ 
        1, 
        2, 
        3, 
        4, 
        5
    ],
    "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/cybersecurity.png"
}, 
{
    "title" : "MEAN Application Development",
    "date" : "20-01-2022",
    "duration" : "4 months",
    "rating" : [ 
        1, 
        2, 
        3
    ],
    "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/meanstack.png"
}
]
testimonals = [ 
  {
      "name" : "Natasa Ishrel",
      "designation" : "Vice President",
      "description" : "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero",
      "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/jessica.png"
  }, 
  {
      "name" : "Johnson",
      "designation" : "Vice President",
      "description" : "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero",
      "imageurl" : "https://lmsassetspremium.lntedutech.com/portalicons/instructor2_2.png"
  }
]
  ngOnInit(): void {
    this.userDetails = JSON.parse(this.appconfig.getSessionStorage('userDetails'));
    this.route.queryParams
    .subscribe(params => {
      this.domainId = atob(params.selectedTab);
      this.areaId = atob(params.id);
      this.btoaId = params.id;
      this.productType = atob(params.productType);
      this.getDetails();
      this.getArea();
      this.scrollTop();
    })
    //on reload or param change
    // this.router.events.pipe(
    //   filter((event: RouterEvent) => event instanceof NavigationEnd),
    //   takeUntil(this.destroyed)
    // ).subscribe(() => {
    //   console.log('3');
    //   this.domainId = this.route.snapshot.queryParams.selectedTab;
    //   this.areaId = this.route.snapshot.queryParams.id;
    //   this.getArea();
    //   this.checkScroll();
    //   this.showAssesment = false;
    // },
    // err =>{
    //   console.log('4');
    //   this.domainId = this.route.snapshot.queryParams.selectedTab;
    //   this.areaId = this.route.snapshot.queryParams.id;
    //   this.getArea();
    //   this.checkScroll();
    //   this.showAssesment = false;
    // });
  }


  scrollTop(){
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  getDetails() {
    this.commonService.getCertificationDetails().subscribe((response :any)=>{
      if(response.success) {
        this.howItWorks = response.data
      }
    })
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  showText() {
    this.isReadMore = !this.isReadMore
  }

  getArea(){
    var params = {
      "domainId" : this.domainId,
      "pagenumber" : this.pageNumber,
      "productType" : this.productType
  }
    this.catalogService.getAreaByDomain(params).subscribe((response : any)=>{
      if (response.data?.length > 0) {
      var areaDetails = response.data
        areaDetails.forEach(element => {
          if (element.cid == this.areaId) {
            this.aboutArea = element;
            if (this.aboutArea?.contentDescription?.length < 370) {
              this.isReadMore = false;
            } else {
              this.isReadMore = true;
            }
          }
        });
        if (this.aboutArea) {
          this.bannerImage = this.aboutArea.image.url;
        }
        this.getCompetency();
      }
    })
  }

  getCompetency(){
    var params = {
      "areaId" :  this.areaId,
      "pagenumber" : 0
    }
    this.catalogService.getCompetency(params).subscribe((response:any)=>{
      if (response.data?.length > 0) {
        this.competencyList = response.data
        this.totalAssessmentCount = 0;
        for(let details of response.data){
          this.totalAssessmentCount += details.totalAssessment
        }
      }
    })
  }

  openAssessments(competency){
    this.aboutArea['contentAchieve'] = competency.contentAchieve
    this.aboutArea['contentRequirement'] = competency.contentRequirement
    this.aboutArea['contentDescription'] = competency.contentDescription
    this.showAssesment = true;
    this.competencyData = competency
  }
}
