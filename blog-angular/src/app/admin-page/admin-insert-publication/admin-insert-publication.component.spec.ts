import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInsertPublicationComponent } from './admin-insert-publication.component';

describe('AdminInsertPublicationComponent', () => {
  let component: AdminInsertPublicationComponent;
  let fixture: ComponentFixture<AdminInsertPublicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminInsertPublicationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminInsertPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
