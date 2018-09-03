import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RsResultComponent } from './rs-result.component';

describe('RsResultComponent', () => {
  let component: RsResultComponent;
  let fixture: ComponentFixture<RsResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RsResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RsResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
