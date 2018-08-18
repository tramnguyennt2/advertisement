import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatDropDownComponent } from './cat-drop-down.component';

describe('CatDropDownComponent', () => {
  let component: CatDropDownComponent;
  let fixture: ComponentFixture<CatDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
