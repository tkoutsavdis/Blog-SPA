import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationPanelComponent } from './publication-panel.component';

describe('PublicationPanelComponent', () => {
  let component: PublicationPanelComponent;
  let fixture: ComponentFixture<PublicationPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicationPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
