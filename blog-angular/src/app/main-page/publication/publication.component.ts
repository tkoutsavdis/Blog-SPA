import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../services/publicationService/publication.service';
import { Publication } from '../../models/publication';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'publication',
  templateUrl: './publication.component.html',
  styleUrl: './publication.component.css'
})
export class PublicationComponent implements OnInit{

  // declaration (vars) 
  publication!:Publication;
  id!:number;

  publicationTitle: string = '';
  publicationType: string = '';
  publicationContent!: SafeHtml;
  publicationDate: string = '';

  firstImageUrl: string = '';
  otherImages: string[] = [];

  // constructor 
  constructor(
    private publicationService:PublicationService,
    private route:ActivatedRoute,
    private sanitizer: DomSanitizer
  ){}

  /*    onInit
    a) take the id from url 
    b) call the api
  */

  ngOnInit(): void {

    this.route.queryParams.subscribe(params =>{
      this.id = params['id'];
    });
    
    this.getPublication();
  }

  /* call api method to take info and images of publications 

    a) handle the type 
    b) handle the images 
  */
  getPublication(): void {
    this.publicationService.getPublicationById(this.id).subscribe((publication) => {

      this.publication = publication;

      this.publicationTitle = publication.title;

      this.publicationDate = publication.dateAndTime;
      
      if (this.publicationDate) {
        const d = new Date(this.publicationDate);
        const day = ('0' + d.getDate()).slice(-2);
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const year = d.getFullYear();
        this.publicationDate = `${day}-${month}-${year}`;
      }
  
      const cleanedContent = publication.content.replace(/&nbsp;/g, ' ');
      this.publicationContent = this.sanitizer.bypassSecurityTrustHtml(cleanedContent);

      this.handleImages();
      this.convertType();

    });
  }

  convertType () :void {
    if (this.publication.type === 'announcement'){

      this.publicationType = 'Ανακοίνωση'

    }else if (this.publication.type === 'action') {

      this.publicationType = 'Δράση'
      
    }else{ 
      this.publicationType = '' ;
    }
  }

  handleImages(): void {
    if (this.publication.images && this.publication.images.length > 0) {
      this.firstImageUrl = this.publication.images[0];
      this.otherImages = this.publication.images.slice(1);
    } else {
      this.firstImageUrl = '';
      this.otherImages = [];
    }
  }

}