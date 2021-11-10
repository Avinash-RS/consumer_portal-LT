import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZcontentCatalogMainRouteComponent } from './zcontent-catalog-main-route.component';

describe('ZcontentCatalogMainRouteComponent', () => {
  let component: ZcontentCatalogMainRouteComponent;
  let fixture: ComponentFixture<ZcontentCatalogMainRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZcontentCatalogMainRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZcontentCatalogMainRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
