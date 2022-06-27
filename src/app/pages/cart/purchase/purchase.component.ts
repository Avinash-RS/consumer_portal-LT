import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CatalogService } from "../../../services/catalog.service";
import { ToastrService } from 'ngx-toastr';
import { AppConfigService } from 'src/app/utils/app-config.service';
import { APP_CONSTANTS } from "src/app/utils/app-constants.service";
import { UtilityService } from 'src/app/services/utility.service';
import { MatStepper } from '@angular/material/stepper';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {
  @ViewChild('form') form: ElementRef;
  @ViewChild('stepper') private myStepper: MatStepper;

  accessCode: any;
  encRequestRes: any;
  order_no: any = 'qaz234567';
  testAmount: any = '10';
  selectedAddress: any = {
    name: 'testing',
    address: 'test address',
    city: 'test city',
    pincode: '23456',
    state: 'state test',
    phone: '1234567890'
  }
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isReadMore = true;
  userDetails;
  cartList = [];
  batchInfo = false;
  totalPrice = 0;
  isOptional = false;
  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private catalogService: CatalogService, public toast: ToastrService,
    private appconfig: AppConfigService, private appConfig: AppConfigService,
    private util: UtilityService
  ) { }

  ngOnInit(): void {
    this.accessCode = 'AVFQ92HF95BT32QFTB';
    this.userDetails = JSON.parse(this.appconfig.getLocalStorage('userDetails'));
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.getCart()
  }
  getCart() {
    var params = {
      "userId": this.userDetails.userId
    }
    this.catalogService.getCart(params).subscribe((response: any) => {
      this.totalPrice = 0
      if (response.data.length > 0) {
        this.cartList = response.data
        this.cartList.forEach((list) => {
          //this.batchInfo = list?.assessmentDetails?.batchDetails;
          list.assessmentDetails.sellingPrice = parseInt(list.assessmentDetails.sellingPrice)
          this.totalPrice += list.assessmentDetails.sellingPrice
        })
        this.isOptional = true;
      } else {
        this.cartList = [];
        this.isOptional = false;
      }
    })
  }

  stepnext(stepper: MatStepper){
    stepper.next();
  }
  showText() {
    this.isReadMore = !this.isReadMore
  }

  toCatalogue() {
    this.appconfig.routeNavigationWithQueryParam(APP_CONSTANTS.ENDPOINTS.catalog.home, { fromPage: btoa("viewAll"), selectedTab: btoa('All') });
  }

  removeAssessment(id) {

    Swal.fire({
      customClass: {
        container: 'swalClass',
      },
      title: 'Are you sure you want to remove the item from cart?',
      showCancelButton: true,
      confirmButtonColor: '#ffffff',
      cancelButtonColor: '#ffffff',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if(result.isConfirmed){
        var params = {
          "userId": this.userDetails.userId,
          "cartId": id
        }
        this.catalogService.removeFromCart(params).subscribe((response: any) => {
          if (response.success) {
            this.toast.success(response.message);
            this.util.cartSubject.next(true);
            this.getCart();
          } else {
            this.toast.warning('Something went wrong')
          }
        })
      }
    });
  }

}
