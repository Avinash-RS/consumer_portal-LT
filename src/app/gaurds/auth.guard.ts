import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AppConfigService } from '../utils/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private appconfig: AppConfigService,
    private toast: ToastrService
  ) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!this.appconfig.getSessionStorage('token')) {
        return true;
      } else {
        if (state.url.includes('login')) {
          this.toast.warning('You have already logged in. Please log out to access Login/Register page')
          return false;
        }
        return true; // it should be false, temporarily i have set it as true
      }
  }
  
}
