import { Component } from '@angular/core';
import { delay } from 'rxjs/operators';
import { LoadingService } from './services/loading.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { AppConfigService } from 'src/app/utils/app-config.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'MicroCertification';
  loading: boolean = true;
  isSticky: boolean = false;
  isMobile: boolean = false;
  platformTxt = navigator.platform;
  runnablePlatforms = ['MacIntel', 'Win32', 'Linux x86_64'];

  constructor(
    private _loading: LoadingService,
    private bnIdle: BnNgIdleService,
    public toast: ToastrService,
    private commonservice: CommonService,
    private appConfig: AppConfigService
  ) {
    console.log('--Browser running on--', navigator.platform);
    if (!this.runnablePlatforms.includes(navigator.platform)) {
      this.isMobile = true;
    }
    if (window.innerWidth < 767) {
      this.isMobile = true;
    }
  }

  ngOnInit() {
    this.bnIdle.startWatching(600).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        var userDetails = JSON.parse(
          this.appConfig.getSessionStorage('userDetails')
        );
        if (userDetails) {
          this.commonservice.logout();
          this.toast.warning('Timed out');
        }
      }
    });
    this.listenToLoading();
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
