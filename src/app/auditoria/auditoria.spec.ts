import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaComponent } from './auditoria';

describe('Auditoria', () => {
  let component: AuditoriaComponent;
  let fixture: ComponentFixture<AuditoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditoriaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditoriaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
