import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerSelectionComponent } from './server-selection.component';

describe('ServerSelectionComponent', () => {
  let component: ServerSelectionComponent;
  let fixture: ComponentFixture<ServerSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
