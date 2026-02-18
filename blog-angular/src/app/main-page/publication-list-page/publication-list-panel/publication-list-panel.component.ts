import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'publication-list-panel',
  templateUrl: './publication-list-panel.component.html',
  styleUrl: './publication-list-panel.component.css'
})
export class PublicationListPanelComponent implements OnInit{

  @Input() id!:number;
  @Input() imageUrl!:string;
  @Input() title!:string;
  @Input() date!:string;
  @Input() content!:string;
  @Input() type!:string;

  constructor(private router:Router){}

  ngOnInit(): void {
    if (this.date) {
      const d = new Date(this.date);
      const day = ('0' + d.getDate()).slice(-2);
      const month = ('0' + (d.getMonth() + 1)).slice(-2);
      const year = d.getFullYear();
      this.date = `${day}-${month}-${year}`;
    }
  }
  

  navigateToPublication(id:number): void {
    this.router.navigate(['/publication'], {
      queryParams: { id: id}
    });
  }

  
}