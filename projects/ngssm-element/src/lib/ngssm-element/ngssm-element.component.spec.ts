import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgssmElementComponent } from './ngssm-element.component';

describe('NgssmElementComponent', () => {
  let component: NgssmElementComponent;
  let fixture: ComponentFixture<NgssmElementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgssmElementComponent]
    });
    fixture = TestBed.createComponent(NgssmElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
