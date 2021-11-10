import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ForgotPasswordComponent } from "./forgotPassword.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("ForgotPasswordComponent", () => {

  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let component: ForgotPasswordComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [ForgotPasswordComponent]
    });

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
