import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  constructor(private router:Router){}

  // navigate to the static pages
  navigate(path: string) {
    this.router.navigateByUrl(path);
  }

  // publications routing
  // actions or announcements 
  navigateToPublications(type: string) {
    this.router.navigate(['/publicationsList'], {
      queryParams: { type: type, page: 1 }
    });
  }
}