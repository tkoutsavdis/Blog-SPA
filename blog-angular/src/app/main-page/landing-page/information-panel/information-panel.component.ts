import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'information-panel',
  templateUrl: './information-panel.component.html',
  styleUrl: './information-panel.component.css'
})
export class InformationPanelComponent {

  constructor(private router: Router){}

  navigate(path:string){
    this.router.navigateByUrl(path);
  }
}
