import { CartService } from "./cart.service";
import { TestBed } from "@angular/core/testing";

describe("CartService", () => {

  let service: CartService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartService
      ]
    });
    service = TestBed.get(CartService);

  });

  it("should be able to create service instance", () => {
    expect(service).toBeDefined();
  });

});
