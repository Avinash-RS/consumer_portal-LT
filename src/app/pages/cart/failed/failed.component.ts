import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { AppConfigService } from 'src/app/utils/app-config.service';
import { APP_CONSTANTS } from "src/app/utils/app-constants.service";

@Component({
  selector: 'app-failed',
  templateUrl: './failed.component.html',
  styleUrls: ['./failed.component.scss']
})
export class FailedComponent implements OnInit {
  payErrTitle = 'Transaction Failed';
  payErrSubtitle = 'The transaction failed due to a technical error. if your money was debited, you should get a refund within next 1-3 days';

  constructor(
    public route: ActivatedRoute,
    private appConfig: AppConfigService,
    private ga_service: GoogleAnalyticsService,
  ) { }

  ngOnInit() {
    this.ga_service.gaSetPage("Payment Failure")
    this.route.queryParams.subscribe(params => {
        if(params.msg){
          this.payErrTitle = 'Payment Not Processed';
          this.payErrSubtitle = 'Payment processing cancelled by user';
        }
        let ga_params = {
          transaction_id:params?.orderId,
          err_msg:this.payErrSubtitle
        }
        this.ga_service.gaEventTrgr("payment_failure","user payment failed" ,"transaction", ga_params)
    })
  }
  gotoCart(){
    this.appConfig.routeNavigation('cart/purchase');
  }
  gotoHome(){
    this.appConfig.routeNavigation(APP_CONSTANTS.ENDPOINTS.home);

  }

}
