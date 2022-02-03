import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-relateditems',
  templateUrl: './relateditems.component.html',
  styleUrls: ['./relateditems.component.scss']
})
export class RelateditemsComponent implements OnInit {

@Input('relateditem') item:any;
  constructor() { }

  ngOnInit(): void {
  }

}
