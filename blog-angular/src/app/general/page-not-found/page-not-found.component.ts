import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})

export class PageNotFoundComponent {

  constructor(private router: Router){

  }

  navigate(path:string): void{
    this.router.navigateByUrl(path);
  }

}