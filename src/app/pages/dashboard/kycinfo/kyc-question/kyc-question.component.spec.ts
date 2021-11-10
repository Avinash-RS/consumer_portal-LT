import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycQuestionComponent } from './kyc-question.component';

describe('KycQuestionComponent', () => {
  let component: KycQuestionComponent;
  let fixture: ComponentFixture<KycQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycQuestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
