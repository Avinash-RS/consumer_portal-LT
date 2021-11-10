import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycPersonalComponent } from './kyc-personal.component';

describe('KycPersonalComponent', () => {
  let component: KycPersonalComponent;
  let fixture: ComponentFixture<KycPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycPersonalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
