import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CarouselImage } from '../../models/carousel';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  private baseUrl:string = environment.apiUrl;
  
  constructor(private http:HttpClient) {}

  updateCarouselImages(files:File[]):Observable<any>{
    const formData: FormData = new FormData();

    files.forEach(file => {
      formData.append('files', file, file.name);
    });

    return this.http.put<any>(`${this.baseUrl}/carousel/updateCarousel`, formData);
  }

  getCarouselImages(): Observable<CarouselImage[]> {
    return this.http.get<CarouselImage[]>(`${this.baseUrl}/carousel/carouselImages`);
  }
  
}