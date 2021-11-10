import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycContactComponent } from './kyc-contact.component';

describe('KycContactComponent', () => {
  let component: KycContactComponent;
  let fixture: ComponentFixture<KycContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
