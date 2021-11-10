import { NO_ERRORS_SCHEMA } from "@angular/core";
import { BarChartComponent } from "./barChart.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("BarChartComponent", () => {

  let fixture: ComponentFixture<BarChartComponent>;
  let component: BarChartComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [BarChartComponent]
    });

    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
