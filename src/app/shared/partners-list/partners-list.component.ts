import { Component, OnInit, Input } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from '@env/environment';

@Component({
  selector: 'app-partners-list',
  templateUrl: './partners-list.component.html',
  styleUrls: ['./partners-list.component.scss']
})
export class PartnersListComponent implements OnInit {
  @Input('OurPartners') OurPartners: any;
  blobToken: string = environment.blobKey;
  partnersCarousel: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    margin: 20,
    navSpeed: 700,
    navText: ["<i class='icon-LeftArrow'></i>", "<i class='icon-RightArrow'></i>"],
    nav: true,
    responsive: {
      0: {
        items: 2
      },
      600: {
        items: 3
      },
      992: {
        items: 3
      },
      1200: {
        items: 3
      }
    }
  }

  constructor() { }

  ngOnInit(): void {

  }

}
