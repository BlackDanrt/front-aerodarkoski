import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioCrud } from './usuario-crud';

describe('UsuarioCrud', () => {
  let component: UsuarioCrud;
  let fixture: ComponentFixture<UsuarioCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsuarioCrud],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
