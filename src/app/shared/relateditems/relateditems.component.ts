import { Component, Input, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-relateditems',
  templateUrl: './relateditems.component.html',
  styleUrls: ['./relateditems.component.scss']
})
export class RelateditemsComponent implements OnInit {

@Input('relateditem') item:any;
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
  constructor() { }

  ngOnInit(): void {
  }

}
