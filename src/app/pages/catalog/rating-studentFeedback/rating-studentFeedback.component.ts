import { Component, OnInit } from "@angular/core";
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: "app-rating-studentFeedback",
  templateUrl: "./rating-studentFeedback.component.html",
  styleUrls: ["./rating-studentFeedback.component.scss"]
})

export class RatingStudentFeedbackComponent implements OnInit {
  
  owlCarouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    autoplay: true,
    autoplayHoverPause: true,
    margin: 15,
    navSpeed: 700,
    navText: ["<i class='icon-LeftArrow'></i>", "<i class='icon-RightArrow'></i>"],
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
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

  constructor() { 

  }

  ngOnInit() {

  }
}
