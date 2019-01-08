import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllItemComponent } from './all-item.component';

describe('AllItemComponent', () => {
  let component: AllItemComponent;
  let fixture: ComponentFixture<AllItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
