import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardReservationComponent } from './card-reservation.component';

describe('CardReservationComponent', () => {
  let component: CardReservationComponent;
  let fixture: ComponentFixture<CardReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardReservationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
