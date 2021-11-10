import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ZcontentMainRouteComponent } from "./zcontent-main-route.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("ZcontentMainRouteComponent", () => {

  let fixture: ComponentFixture<ZcontentMainRouteComponent>;
  let component: ZcontentMainRouteComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [ZcontentMainRouteComponent]
    });

    fixture = TestBed.createComponent(ZcontentMainRouteComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
