import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AddressComponent } from "./Address.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("AddressComponent", () => {

  let fixture: ComponentFixture<AddressComponent>;
  let component: AddressComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [AddressComponent]
    });

    fixture = TestBed.createComponent(AddressComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
