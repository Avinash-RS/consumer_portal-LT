import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertifyAssessmentComponent } from './certify-assessment.component';

describe('CertifyAssessmentComponent', () => {
  let component: CertifyAssessmentComponent;
  let fixture: ComponentFixture<CertifyAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertifyAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertifyAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
