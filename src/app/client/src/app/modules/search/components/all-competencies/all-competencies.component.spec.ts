import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCompetenciesComponent } from './all-competencies.component';

describe('AllCompetenciesComponent', () => {
  let component: AllCompetenciesComponent;
  let fixture: ComponentFixture<AllCompetenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCompetenciesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCompetenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
