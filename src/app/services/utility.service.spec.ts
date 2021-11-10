import { UtilityService } from "./utility.service";
import { TestBed } from "@angular/core/testing";

describe("UtilityService", () => {

  let service: UtilityService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UtilityService
      ]
    });
    service = TestBed.get(UtilityService);

  });

  it("should be able to create service instance", () => {
    expect(service).toBeDefined();
  });

});
