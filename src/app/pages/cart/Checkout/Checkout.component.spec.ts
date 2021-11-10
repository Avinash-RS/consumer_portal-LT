import { NO_ERRORS_SCHEMA } from "@angular/core";
import { CheckoutComponent } from "./Checkout.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("CheckoutComponent", () => {

  let fixture: ComponentFixture<CheckoutComponent>;
  let component: CheckoutComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [CheckoutComponent]
    });

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
