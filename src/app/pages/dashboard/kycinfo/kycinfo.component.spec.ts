import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KYCinfoComponent } from './kycinfo.component';

describe('KYCinfoComponent', () => {
  let component: KYCinfoComponent;
  let fixture: ComponentFixture<KYCinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KYCinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
