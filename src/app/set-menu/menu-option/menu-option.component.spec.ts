import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuOptionComponent } from './menu-option.component';

describe('MenuOptionComponent', () => {
  let component: MenuOptionComponent;
  let fixture: ComponentFixture<MenuOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
