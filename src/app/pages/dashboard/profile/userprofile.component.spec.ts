import { NO_ERRORS_SCHEMA } from "@angular/core";
import { UserprofileComponent } from "./userprofile.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("UserprofileComponent", () => {

  let fixture: ComponentFixture<UserprofileComponent>;
  let component: UserprofileComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [UserprofileComponent]
    });

    fixture = TestBed.createComponent(UserprofileComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
