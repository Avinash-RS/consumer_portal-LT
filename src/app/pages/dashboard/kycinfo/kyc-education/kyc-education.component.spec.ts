import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycEducationComponent } from './kyc-education.component';

describe('KycEducationComponent', () => {
  let component: KycEducationComponent;
  let fixture: ComponentFixture<KycEducationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycEducationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
