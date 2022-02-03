import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelateditemsComponent } from './relateditems.component';

describe('RelateditemsComponent', () => {
  let component: RelateditemsComponent;
  let fixture: ComponentFixture<RelateditemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelateditemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelateditemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
