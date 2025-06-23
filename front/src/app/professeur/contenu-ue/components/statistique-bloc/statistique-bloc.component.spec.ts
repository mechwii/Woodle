import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiqueBlocComponent } from './statistique-bloc.component';

describe('StatistiqueBlocComponent', () => {
  let component: StatistiqueBlocComponent;
  let fixture: ComponentFixture<StatistiqueBlocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatistiqueBlocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatistiqueBlocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
