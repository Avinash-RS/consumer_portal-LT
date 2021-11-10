import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycPreviewComponent } from './kyc-preview.component';

describe('KycPreviewComponent', () => {
  let component: KycPreviewComponent;
  let fixture: ComponentFixture<KycPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
