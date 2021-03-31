import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractActionResultComponent } from './contract-action-result.component';

describe('ContractActionResultComponent', () => {
  let component: ContractActionResultComponent;
  let fixture: ComponentFixture<ContractActionResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractActionResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractActionResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
