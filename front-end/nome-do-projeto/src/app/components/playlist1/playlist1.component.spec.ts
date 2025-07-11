/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Playlist1Component } from './playlist1.component';

describe('Playlist1Component', () => {
  let component: Playlist1Component;
  let fixture: ComponentFixture<Playlist1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Playlist1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Playlist1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
