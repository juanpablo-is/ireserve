import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetMenuComponent } from './set-menu.component';

describe('SetMenuComponent', () => {
  let component: SetMenuComponent;
  let fixture: ComponentFixture<SetMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
