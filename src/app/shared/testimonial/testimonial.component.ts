import { Component, Input, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss']
})
export class TestimonialComponent implements OnInit {
  @Input('testimonal') testimonal;
   // Testimonial
   testimonialOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    margin: 30,
    center: true,
    navText: ["<i class='icon-Back'></i>", "<i class='icon-right-next'></i>"],
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      650: {
        items: 3
      },
      1024: {
        items: 3
      }
    }
  }
  constructor() { }

  ngOnInit(): void {
  }

}
