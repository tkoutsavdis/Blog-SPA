import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { globalTitles } from '../../models/globalTitles';
import { Publication } from '../../models/publication';
import { PublicationList } from '../../models/publicationList';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  constructor(private http:HttpClient) { }

   /*
    ***************** URLS *****************
  */

  private baseUrl:string = environment.apiUrl;

  private insertUrl = `${this.baseUrl}/publications/insertPublication`;
  private updateUrl = `${this.baseUrl}/publications/updatePublication`;
  private deleteUrl = `${this.baseUrl}/publications/deletePublication`;

   /*
    ***************** GET APIS *****************
    1) GET titles by Type
    2) GET publication by title
    3) Get publication number 
  */

  // get Titles
  getTitles(type:string):Observable<globalTitles[]>{

    return this.http.get<globalTitles[]>(`${this.baseUrl}/publications/getTitlesByType?type=${type}`);
  }

  getPublicationByTitle(title:string):Observable<Publication>{
    const encodedTitle = encodeURIComponent(title);
    return this.http.get<Publication>(`${this.baseUrl}/publications/getPublicationByTitle?title=${encodedTitle}`);
  }

  getPublicationNumber(type:string):Observable<any> {
    const params = new HttpParams()
    .set('type', type)

    return this.http.get<any>(`${this.baseUrl}/publications/getNumberOfPublications`,{params})
  }

  getPublicationList(type:string,page:number):Observable<PublicationList[]> {
    const params = new HttpParams()
    .set('type', type)
    .set('page', page.toString())

    return this.http.get<PublicationList[]>(`${this.baseUrl}/publications/getPublicationsList`,{params})
  }

  getRecentPublications(type:string):Observable<PublicationList[]>{
    const params = new HttpParams()
    .set('type', type)

    return this.http.get<PublicationList[]>(`${this.baseUrl}/publications/getRecentPublications`,{params})
  }

  getPublicationById(id:number):Observable<Publication>{
    const params = new HttpParams()
    .set('id',id)

    return this.http.get<Publication>(`${this.baseUrl}/publications/getPublicationById`,{params});
  }

  /*
    ***************** POST/DELETE/UPDATE APIS *****************
    1) insert new publication
    2) update existing publication
    3) delete existing publication
  */

  // add new publication
  insertPublication(
    type:string,
    title:string,
    content:string,
    dateAndTime:string,
    files: File[])
  :Observable<any>{

    const formData: FormData = new FormData();

    formData.append('type',type);
    formData.append('title',title);
    formData.append('content',content);
    formData.append('dateAndTime',dateAndTime);
    files.forEach(file => {
      formData.append('files', file, file.name);
    });

    return this.http.post<any>(`${this.insertUrl}`, formData);
  }

  // update existing publication
  updatePublication(
    id:number,
    type:string,
    title:string,
    content:string,
    dateAndTime:string,
    files: File[])
  :Observable<any>{

    const formData: FormData = new FormData();
    formData.append('id',id.toString());
    formData.append('type',type);
    formData.append('title',title);
    formData.append('content',content);
    formData.append('dateAndTime',dateAndTime);
    files.forEach(file => {
      formData.append('files', file, file.name);
    });

    return this.http.put<any>(`${this.updateUrl}`, formData);
  }

  deletePublication(id: number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<any>(`${this.deleteUrl}`, { params });
  }
  
}