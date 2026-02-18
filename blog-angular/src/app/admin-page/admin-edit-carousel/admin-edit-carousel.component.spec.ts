import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditCarouselComponent } from './admin-edit-carousel.component';

describe('AdminEditCarouselComponent', () => {
  let component: AdminEditCarouselComponent;
  let fixture: ComponentFixture<AdminEditCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminEditCarouselComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminEditCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
