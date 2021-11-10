import { Component, OnInit, Input } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-examination',
  templateUrl: './examination.component.html',
  styleUrls: ['./examination.component.scss']
})
export class ExaminationComponent implements OnInit {
  @Input('Examination') Examination: any;
  selection;
  rightContent: any;
  blobToken: string = environment.blobKey;

  constructor() { }

  ngOnInit(): void {
    this.Examination[0].Active = true;
    this.rightContent = this.Examination[0];
  }

  selectTypes(value) {
    this.rightContent = value;
    this.Examination.forEach((data)=> {
      data.Active = false;
      if(data.name == value.name) {
        data.Active = true;
      }
    })
  }

}
