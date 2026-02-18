import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationListPanelComponent } from './publication-list-panel.component';

describe('PublicationListPanelComponent', () => {
  let component: PublicationListPanelComponent;
  let fixture: ComponentFixture<PublicationListPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicationListPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicationListPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
