import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseItemDetailComponent } from './base-item-detail.component';

describe('BaseItemDetailComponent', () => {
  let component: BaseItemDetailComponent;
  let fixture: ComponentFixture<BaseItemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseItemDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
