import { NO_ERRORS_SCHEMA } from "@angular/core";
import { OnBoardingMainRouteComponent } from "./on-boarding-main-route.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("OnBoardingMainRouteComponent", () => {

  let fixture: ComponentFixture<OnBoardingMainRouteComponent>;
  let component: OnBoardingMainRouteComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [OnBoardingMainRouteComponent]
    });

    fixture = TestBed.createComponent(OnBoardingMainRouteComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
