import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZcontentCartMainRouteComponent } from './zcontent-cart-main-route/zcontent-cart-main-route.component';
import { PurchaseComponent } from './purchase/purchase.component';
import {SuccessComponent} from './success/success.component';
import {FailedComponent} from './failed/failed.component';
const routes: Routes = [
  {path: '', component: ZcontentCartMainRouteComponent, children: [
    {
      path: 'purchase', component: PurchaseComponent,
    },
    {
      path: '' , redirectTo: 'purchase'
    },
    {
      path: 'success', component: SuccessComponent,
    },
    {
      path: 'failed', component: FailedComponent,
    }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
