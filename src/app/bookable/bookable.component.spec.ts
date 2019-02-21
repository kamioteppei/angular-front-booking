import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookableComponent } from './bookable.component';

describe('BookableComponent', () => {
  let component: BookableComponent;
  let fixture: ComponentFixture<BookableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
