import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/gaurds/auth.guard';
import { APP_CONSTANTS } from 'src/app/utils/app-constants.service';
import { ForgotPasswordComponent } from './forgotPassword/forgotPassword.component';
import { LoginComponent } from './login/login.component';
import { OnBoardingMainRouteComponent } from './on-boarding-main-route/on-boarding-main-route.component';

const routes: Routes = [
  {
    path: '', component: OnBoardingMainRouteComponent, children: [
      {
        path: APP_CONSTANTS.ROUTES.onBoard.login, component: LoginComponent, canActivate: [AuthGuard]
      },
      {
        path: APP_CONSTANTS.ROUTES.onBoard.forgetpwd, component: ForgotPasswordComponent,
      },
      {
        path: '', redirectTo: APP_CONSTANTS.ROUTES.onBoard.login,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnBoardingRoutingModule { }
