import { NO_ERRORS_SCHEMA } from "@angular/core";
import { RatingStudentFeedbackComponent } from "./rating-studentFeedback.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("RatingStudentFeedbackComponent", () => {

  let fixture: ComponentFixture<RatingStudentFeedbackComponent>;
  let component: RatingStudentFeedbackComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [RatingStudentFeedbackComponent]
    });

    fixture = TestBed.createComponent(RatingStudentFeedbackComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
