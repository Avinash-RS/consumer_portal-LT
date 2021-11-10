import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycPassportComponent } from './kyc-passport.component';

describe('KycPassportComponent', () => {
  let component: KycPassportComponent;
  let fixture: ComponentFixture<KycPassportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycPassportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycPassportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
