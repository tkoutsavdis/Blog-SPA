import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationListPageComponent } from './publication-list-page.component';

describe('PublicationListPageComponent', () => {
  let component: PublicationListPageComponent;
  let fixture: ComponentFixture<PublicationListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicationListPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicationListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
