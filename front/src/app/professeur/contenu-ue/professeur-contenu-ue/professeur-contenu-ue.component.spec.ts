import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesseurContenuUeComponent } from './professeur-contenu-ue.component';

describe('ProfesseurContenuUeComponent', () => {
  let component: ProfesseurContenuUeComponent;
  let fixture: ComponentFixture<ProfesseurContenuUeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesseurContenuUeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfesseurContenuUeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
