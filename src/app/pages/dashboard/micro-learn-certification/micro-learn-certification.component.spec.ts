import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroLearnCertificationComponent } from './micro-learn-certification.component';

describe('MicroLearnCertificationComponent', () => {
  let component: MicroLearnCertificationComponent;
  let fixture: ComponentFixture<MicroLearnCertificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MicroLearnCertificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroLearnCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
