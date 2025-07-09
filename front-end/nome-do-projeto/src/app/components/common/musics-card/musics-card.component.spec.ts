import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicsCardComponent } from './musics-card.component';

describe('MusicsCardComponent', () => {
  let component: MusicsCardComponent;
  let fixture: ComponentFixture<MusicsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusicsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
