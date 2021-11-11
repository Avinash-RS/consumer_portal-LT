import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kyc-mandate',
  templateUrl: './kyc-mandate.component.html',
  styleUrls: ['./kyc-mandate.component.scss']
})
export class KycMandateComponent implements OnInit {

  constructor(private router:Router, private dialog:MatDialog) { }

  ngOnInit(): void {
  }

  navigateProfile(){
    this.router.navigate(['/userProfile']);
    this.selfClose();
  }
  selfClose(){
    localStorage.setItem('openMandate',"true")
    this.dialog.closeAll();
  }


}
