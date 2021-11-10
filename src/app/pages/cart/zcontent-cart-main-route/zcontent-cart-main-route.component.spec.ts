import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZcontentCartMainRouteComponent } from './zcontent-cart-main-route.component';

describe('ZcontentCartMainRouteComponent', () => {
  let component: ZcontentCartMainRouteComponent;
  let fixture: ComponentFixture<ZcontentCartMainRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZcontentCartMainRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZcontentCartMainRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
