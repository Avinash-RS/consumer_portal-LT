import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { AppConfigService } from 'src/app/utils/app-config.service';
import { APP_CONSTANTS } from 'src/app/utils/app-constants.service';
@Component({
  selector: 'app-featured-courses',
  templateUrl: './featured-courses.component.html',
  styleUrls: ['./featured-courses.component.scss']
})
export class FeaturedCoursesComponent implements OnInit {

  // @ViewChild(DragScrollComponent, { static: true }) ds: DragScrollComponent;
  @ViewChild('featuredCourses', { read: DragScrollComponent }) ds: DragScrollComponent;
  @Input('catalogData') catalogData:any;
  leftNavDisabled = false;
  rightNavDisabled = false;
  constructor(private appConfig: AppConfigService,) {
    
   }

  ngOnInit(): void {
    console.log(this.catalogData);
  }

  moveLeft() {
    this.ds.moveLeft();
  }
  moveRight() {
    this.ds.moveRight();
  }
  leftBoundStat(reachesLeftBound: boolean) {
    this.leftNavDisabled = reachesLeftBound;
  }

  rightBoundStat(reachesRightBound: boolean) {
    this.rightNavDisabled = reachesRightBound;
  }
aboutCourse(cid){
  this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.aboutCourse, { id: btoa(cid), selectedTab: btoa('All') ,productType : btoa('course')});
}
}
