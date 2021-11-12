import { Injectable, } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { Subject,Observable,BehaviorSubject} from "rxjs";

/**
 * @description
 * @class
 */
@Injectable(
  {
    providedIn: 'root'
  }
)
export class UtilityService {
 
   // For avatar image updation
  headerSubject = new Subject();

  //For cart count updation
  cartSubject = new Subject();

  //For address data to payment Communication
  addressSubject = new Subject();

  //For navigating Parent KYC tabs
  ParentkyctabSubject = new Subject();

  //For navigating KYC tabs
  kyctabSubject = new Subject();
  
  //For trigering profile percentage
  percentageSubject = new Subject();
  
  //For hiding progessbar in dashboard
  showkycProgress = new Subject();
  
  // move to cart directly from login
  private cartValue: BehaviorSubject<any> = new BehaviorSubject<any>(null); 
  public setValue(value: any): void {
    this.cartValue.next(value);
}

public getValue(): Observable < any > {
    return this.cartValue;
}
  constructor(private toastr: ToastrService) {
    
  }
  toast_success(title,subtitle){
    let params = {

    }
    this.toastr.error(title, subtitle);
  }
}
