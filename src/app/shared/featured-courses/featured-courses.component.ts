import { Component, OnInit, ViewChild } from '@angular/core';
import { DragScrollComponent } from 'ngx-drag-scroll';

@Component({
  selector: 'app-featured-courses',
  templateUrl: './featured-courses.component.html',
  styleUrls: ['./featured-courses.component.scss']
})
export class FeaturedCoursesComponent implements OnInit {

  // @ViewChild(DragScrollComponent, { static: true }) ds: DragScrollComponent;
  @ViewChild('featuredCourses', { read: DragScrollComponent }) ds: DragScrollComponent;
  
  leftNavDisabled = false;
  rightNavDisabled = false;
  constructor() { }

  ngOnInit(): void {
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

}
