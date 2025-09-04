import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketCardComponent } from './basket-card-component';

describe('BasketCardComponent', () => {
  let component: BasketCardComponent;
  let fixture: ComponentFixture<BasketCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasketCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasketCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
