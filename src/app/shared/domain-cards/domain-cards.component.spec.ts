import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainCardsComponent } from './domain-cards.component';

describe('DomainCardsComponent', () => {
  let component: DomainCardsComponent;
  let fixture: ComponentFixture<DomainCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
