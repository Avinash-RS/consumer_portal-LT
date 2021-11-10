import { NO_ERRORS_SCHEMA } from "@angular/core";
import { SkillDashboardComponent } from "./skillDashboard.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("SkillDashboardComponent", () => {

  let fixture: ComponentFixture<SkillDashboardComponent>;
  let component: SkillDashboardComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [SkillDashboardComponent]
    });

    fixture = TestBed.createComponent(SkillDashboardComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
