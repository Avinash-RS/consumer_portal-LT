import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MyAssessmentComponent } from "./myAssessment.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("MyAssessmentComponent", () => {

  let fixture: ComponentFixture<MyAssessmentComponent>;
  let component: MyAssessmentComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [MyAssessmentComponent]
    });

    fixture = TestBed.createComponent(MyAssessmentComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
