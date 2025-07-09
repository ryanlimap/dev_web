import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayBarComponent } from './play-bar.component';

describe('PlayBarComponent', () => {
  let component: PlayBarComponent;
  let fixture: ComponentFixture<PlayBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
