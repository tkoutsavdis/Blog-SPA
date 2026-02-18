import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../../services/publicationService/publication.service';
import { PublicationList } from '../../../models/publicationList';
import { Router } from '@angular/router';

@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit{

  announcementList: PublicationList[] = [];
  actionList: PublicationList[] = [];

  constructor(
    private publicationService:PublicationService,
    private router:Router
  ){}

  ngOnInit(){
    this.getRecentAnnouncements();
    this.getRecentActions();
  }

  getRecentAnnouncements(){
    this.publicationService.getRecentPublications('announcement').subscribe((publication) =>{
      this.announcementList = publication;
    });
  }

  getRecentActions(){
    this.publicationService.getRecentPublications('action').subscribe((publication) =>{
      this.actionList = publication;
    });
  }

  navigateToPublications(type: string) {
    this.router.navigate(['/publicationsList'], {
      queryParams: { type: type, page: 1 }
    });
  }
}