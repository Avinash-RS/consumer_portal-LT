import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './gaurds/auth.guard';
import { CartCanLoadGuard } from './gaurds/canload/cart-can-load.guard';
import { APP_CONSTANTS } from './utils/app-constants.service';

const routes: Routes = [
  {
    path: '', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard]
  },
  {
    path: APP_CONSTANTS.ROUTES.onBoard.home, loadChildren: () => import('./pages/on-boarding/on-boarding.module').then(m => m.OnBoardingModule)
  },
  {
    path: APP_CONSTANTS.ROUTES.catalog.home, loadChildren: () => import('./pages/catalog/catalog.module').then(m => m.CatalogModule)
  },
  {
    path: APP_CONSTANTS.ROUTES.skillOMeter.dashBoard, loadChildren: () => import('./pages/skill-ometer/skill-ometer.module').then(m => m.SkillOMeterModule)
  },
  {
    path: 'cart', loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartModule), canLoad: [CartCanLoadGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
