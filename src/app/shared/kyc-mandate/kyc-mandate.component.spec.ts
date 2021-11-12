import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycMandateComponent } from './kyc-mandate.component';

describe('KycMandateComponent', () => {
  let component: KycMandateComponent;
  let fixture: ComponentFixture<KycMandateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycMandateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycMandateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
