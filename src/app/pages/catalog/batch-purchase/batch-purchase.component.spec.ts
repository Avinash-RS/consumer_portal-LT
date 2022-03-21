import { NO_ERRORS_SCHEMA } from "@angular/core";
import { BatchPurchaseComponent } from "./batch-purchase.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("BatchPurchaseComponent", () => {

  let fixture: ComponentFixture<BatchPurchaseComponent>;
  let component: BatchPurchaseComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [BatchPurchaseComponent]
    });

    fixture = TestBed.createComponent(BatchPurchaseComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
