import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.closeOffcanvas();
      }
    });
  }
  
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
  

  closeOffcanvas(): void {
    const offcanvasEl = document.getElementById('offcanvasNavbar');
    if (offcanvasEl) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      }
    }
  }
  
}