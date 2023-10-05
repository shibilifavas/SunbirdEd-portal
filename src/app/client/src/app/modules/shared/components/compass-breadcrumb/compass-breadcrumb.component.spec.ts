import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompassBreadcrumbComponent } from './compass-breadcrumb.component';

describe('CompassBreadcrumbComponent', () => {
  let component: CompassBreadcrumbComponent;
  let fixture: ComponentFixture<CompassBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompassBreadcrumbComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompassBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
