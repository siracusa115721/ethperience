import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprarTokensComponent } from './comprar-tokens.component';

describe('ComprarTokensComponent', () => {
  let component: ComprarTokensComponent;
  let fixture: ComponentFixture<ComprarTokensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComprarTokensComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprarTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
