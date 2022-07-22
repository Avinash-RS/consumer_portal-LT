import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { AppConfigService } from 'src/app/utils/app-config.service';
import { APP_CONSTANTS } from 'src/app/utils/app-constants.service';

@Injectable({
  providedIn: 'root'
})
export class CartCanLoadGuard implements CanActivate, CanLoad {
  secretKey = "(!@#Passcode!@#)";
  constructor(
    private appconfig: AppConfigService,
    public toast: ToastrService,
    private commonService:CommonService
  ) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.appconfig.getLocalStorage('token')) {
      return true;
    } else {
      this.appconfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, {fromPage: this.commonService.encrypt('0',this.secretKey)});
      return false;
    }
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.appconfig.getLocalStorage('token')) {
        return true;
      } else {
        this.toast.warning('Please login to access the cart section');
        this.appconfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.onBoard.login, {fromPage: this.commonService.encrypt('0',this.secretKey)});
        return false;
      }
    }
}
