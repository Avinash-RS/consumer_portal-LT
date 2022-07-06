import { Component,HostListener } from '@angular/core';
import { delay } from 'rxjs/operators';
import { LoadingService } from './services/loading.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { AppConfigService } from 'src/app/utils/app-config.service';
import { Gtag } from 'angular-gtag';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
declare var gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'MicroCertification';
  secretKey = "(!@#Passcode!@#)";
  loading: boolean = true;
  isSticky: boolean = false;
  isMobile: boolean = false;
  platformTxt = navigator.platform;
  runnablePlatforms = ['MacIntel', 'Win32', 'Linux x86_64'];
  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
  event.preventDefault();

}
@HostListener('document:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {
  if ( (event.which === 67 && event.ctrlKey && event.shiftKey) || (event.which === 123) ||
   (event.which === 73 && event.ctrlKey && event.shiftKey) ) {
    event.returnValue = false;
    event.preventDefault();
  }
}
@HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
  e.preventDefault();
}
  constructor(
    private _loading: LoadingService,
    private bnIdle: BnNgIdleService,
    public toast: ToastrService,
    private commonservice: CommonService,
    private appConfig: AppConfigService,
    private router: Router,
    private gtag: Gtag,
  ) {
    // console.log('--Browser running on--', navigator.platform);
    // if (!this.runnablePlatforms.includes(navigator.platform)) {
    //   this.isMobile = true;
    // }
    // if (window.innerWidth < 767) {
    //   this.isMobile = true;
    // }
       // GOOGLE ANALYTICS INIT
  //    if (environment.gaTrackingId) {
    // register google tag manager
    const gTagManagerScript = document.createElement('script');
    gTagManagerScript.async = true;
    gTagManagerScript.src = `https://www.googletagmanager.com/gtag/js?id=${environment.gaMeasureId}`;
    document.head.appendChild(gTagManagerScript);
    let user_id = null;
    var userDetails = JSON.parse(this.appConfig.getLocalStorage('userDetails'));
    if (userDetails?.userId) {
       user_id = CryptoJS.AES.decrypt(userDetails.userId, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
    }
  //   // register google analytics
    const gaScript = document.createElement('script');
    gaScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('set', 'user_properties', { 'userID' : '${user_id}' });
      gtag('config', '${environment.gaMeasureId}',{ 'send_page_view': false, 'userID' : '${user_id}' });
      `;
    document.head.appendChild(gaScript);
  // }
  this.gtag.set({ userID : user_id });
  }

  ngOnInit() {
    this.bnIdle.startWatching(1200).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        var userDetails = JSON.parse(
          this.appConfig.getLocalStorage('userDetails')
        );
        if (userDetails) {
          this.commonservice.logout();
          this.toast.warning('Timed out');
        }
      }
    });
    this.listenToLoading();
  //   console.log("start")
  //   this.gtag.pageview({
  //     page_title: 'L&T Edutech',
  //     page_path: this.router.url,
  //     page_location: window.location.href,
  //     userID: "PV-Test"
  //   });

  //   console.log("end")
  }
  /**
   * Listen and display the loading spinner.
   */
  listenToLoading(): void {
    this._loading.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
      });
  }
}
