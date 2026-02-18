import { Component } from '@angular/core';
import { CarouselService } from '../../../services/carouselService/carousel.service';
import { CarouselImage } from '../../../models/carousel';

@Component({
  selector: 'landing-carousel',
  templateUrl: './landing-carousel.component.html',
  styleUrl: './landing-carousel.component.css'
})
export class LandingCarouselComponent {

  carouselImages: CarouselImage[] = [];

  constructor(private carouselService:CarouselService){}
  
  ngOnInit(){
    this.carouselService.getCarouselImages().subscribe({
      next: (data) => {
        this.carouselImages = data;
      },
      error: (err) => {
        console.error('Error fetching carousel images:', err);
      }
    })
  }
}