import { Component } from '@angular/core';
import { PublicationList } from '../../../models/publicationList';
import { PublicationService } from '../../../services/publicationService/publication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-publication-list-page',
  templateUrl: './publication-list-page.component.html',
  styleUrl: './publication-list-page.component.css'
})
export class PublicationListPageComponent {

    type: string = '';
    finalTitle:string = '';
  
    items: string[] = [];
    pagedItems: string[] = [];
  
    totalItems: number = 0;
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalPages: number = 0;

    publicationList : PublicationList[] = [];
  
    constructor(
      private route:ActivatedRoute,
      private publicationService: PublicationService,
      private router: Router
    ){
    }
  
    /* 
      On init 
      1) take the query parameters to take the type : 'announcements' or 'actions'
      2) Call the api to take the information 
    */
  
    ngOnInit(): void {
      this.route.queryParams.subscribe(params =>{
        this.type = params['type'];

        this.currentPage = params['page'] ? +params['page'] : 1;


        if(this.type == 'action'){
  
          this.finalTitle = 'Δράσεις';
  
        }else if (this.type == 'announcement'){
  
          this.finalTitle = 'Ανακοινώσεις';
  
        }else{
          this.finalTitle = '';
        }

        this.fetchPublicationCount();
      });
    }
  
    fetchPublicationCount(): void {
      this.publicationService.getPublicationNumber(this.type).subscribe((response: any) => {
            this.totalItems = Number(response.publicationsnumber);
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
            this.getPublicationList();
          }
        );
    }
  
    onPageChange(page: number): void {
      this.currentPage = page;

      this.router.navigate([], {
        queryParams: { page: this.currentPage },
        queryParamsHandling: 'merge'
      });

      this.getPublicationList();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    getPublicationList(){ 
      this.publicationService.getPublicationList(this.type,this.currentPage).subscribe((res) => {
        this.publicationList = res;
      });
    }
}