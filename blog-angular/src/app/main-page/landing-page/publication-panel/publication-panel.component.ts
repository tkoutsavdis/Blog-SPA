import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'publication-panel',
  templateUrl: './publication-panel.component.html',
  styleUrl: './publication-panel.component.css'
})
export class PublicationPanelComponent {

  // basic vars
  @Input() id !: number;
  @Input() title!: string;
  @Input() backgroundImage!: string;
  showFullTitle: boolean = false;

  // constructor 
  constructor(private router:Router){}

  // helper methods for the title 

  get truncatedTitle(): string {
    return this.title.length > 35 ? this.title.slice(0, 35) + '...' : this.title;
  }

  get truncatedTitleExpand(): string {
    return this.title.length > 70 ? this.title.slice(0, 70) + '...' : this.title;
  }

  onHover(state: boolean): void {
    this.showFullTitle = state;
  }

  // navigate mathod to specific publication page 

  navigateToPublication(id:number): void {
    this.router.navigate(['/publication'], {
      queryParams: { id: id}
    });
  }
}