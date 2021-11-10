import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FaqComponent } from "./faq.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("FaqComponent", () => {

  let fixture: ComponentFixture<FaqComponent>;
  let component: FaqComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [FaqComponent]
    });

    fixture = TestBed.createComponent(FaqComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
