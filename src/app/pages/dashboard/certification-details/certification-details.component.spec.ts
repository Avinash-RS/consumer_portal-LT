import { NO_ERRORS_SCHEMA } from "@angular/core";
import { CertificationDetailsComponent } from "./certification-details.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("CertificationDetailsComponent", () => {

  let fixture: ComponentFixture<CertificationDetailsComponent>;
  let component: CertificationDetailsComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [CertificationDetailsComponent]
    });

    fixture = TestBed.createComponent(CertificationDetailsComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
