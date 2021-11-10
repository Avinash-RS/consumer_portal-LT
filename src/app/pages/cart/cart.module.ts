import { NgModule,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { CartRoutingModule } from './cart-routing.module';

import { ZcontentCartMainRouteComponent } from './zcontent-cart-main-route/zcontent-cart-main-route.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { AddressComponent } from './Address/Address.component';
import { CheckoutComponent } from './Checkout/Checkout.component';

//Carousel Module
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SuccessComponent } from './success/success.component';
import { FailedComponent } from './failed/failed.component';


@NgModule({
  declarations: [
    ZcontentCartMainRouteComponent, 
    PurchaseComponent, 
    AddressComponent, 
    CheckoutComponent,
    SuccessComponent,
    FailedComponent
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    SharedModule,
    CarouselModule
  ],
  exports : [PurchaseComponent, AddressComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [
  ]
})
export class CartModule { }
