import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocDropDownComponent } from './loc-drop-down.component';

describe('LocDropDownComponent', () => {
  let component: LocDropDownComponent;
  let fixture: ComponentFixture<LocDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
