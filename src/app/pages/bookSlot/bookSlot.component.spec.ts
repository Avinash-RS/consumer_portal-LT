import { NO_ERRORS_SCHEMA } from "@angular/core";
import { BookSlotComponent } from "./bookSlot.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("BookSlotComponent", () => {

  let fixture: ComponentFixture<BookSlotComponent>;
  let component: BookSlotComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [BookSlotComponent]
    });

    fixture = TestBed.createComponent(BookSlotComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
