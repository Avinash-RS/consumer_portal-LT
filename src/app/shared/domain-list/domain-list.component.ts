import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from "@angular/router"
import { AppConfigService } from 'src/app/utils/app-config.service';
import { APP_CONSTANTS } from 'src/app/utils/app-constants.service';
import { CatalogService } from "../../services/catalog.service"

@Component({
  selector: 'app-domain-list',
  templateUrl: './domain-list.component.html',
  styleUrls: ['./domain-list.component.scss']
})
export class DomainListComponent implements OnInit {

  owlCarouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    margin: 30,
    navSpeed: 700,
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
      },
      1024: {
        items: 3
      },
      1200: {
        items: 3
      }
    }
  }
  catalogList;
  longContent: any;
  constructor(private appConfig: AppConfigService, private catalogService : CatalogService) { }

  ngOnInit(){
    this.getCatalogList()
  }

  getCatalogList() {
    this.catalogService.getCatalog().subscribe((response : any)=>{
      if (response.data.length > 0) {
        this.catalogList = response.data;
        this.longContent = response.data.longDescription;
      } else{
        this.catalogList = []
      }
    })
  }

  catalogHome(value) {
    this.appConfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.home, {fromPage : "viewAll",selectedTab : value});
  }
}
