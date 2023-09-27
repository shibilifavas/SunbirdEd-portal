import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LearnPageContentService {

  constructor(private http: HttpClient) { }

  getPageContent(){
    return this.http.get('/learnLandingPageContent');
  }

  getBrowseByCompetencyData(data: any){
    return this.http.post(`/api/content/v1/search?orgdetails=orgName,email&licenseDetails=name,description,url`, data);
  }
}
