import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-home',
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {

  constructor(private router:Router){}

  navigate(path:string){
    this.router.navigateByUrl(path);
  }
}
