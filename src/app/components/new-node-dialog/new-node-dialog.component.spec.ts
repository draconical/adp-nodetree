import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNodeDialogComponent } from './new-node-dialog.component';

describe('NewNodeDialogComponent', () => {
  let component: NewNodeDialogComponent;
  let fixture: ComponentFixture<NewNodeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewNodeDialogComponent]
    });
    fixture = TestBed.createComponent(NewNodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
