import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditPublicationComponent } from './admin-edit-publication.component';

describe('AdminEditPublicationComponent', () => {
  let component: AdminEditPublicationComponent;
  let fixture: ComponentFixture<AdminEditPublicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminEditPublicationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminEditPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
