import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LearnPageContentService {

  // competencyApiUrl = envHelper.CONTENT_URL;
  competencyApiUrl = 'https://compass-dev.tarento.com/api/content/v1';

  constructor(private http: HttpClient) { }

  getPageContent(){
    return this.http.get('/learnLandingPageContent');
  }

  getBrowseByCompetencyData(data: any){
    return this.http.post(`${this.competencyApiUrl}/search?orgdetails=orgName,email&licenseDetails=name,description,url`, data);
  }

  search(requestBody) {
    const url = `/api/content/v1/search?orgdetails=orgName,email`;
    return this.http.post(url, requestBody)
      .pipe(map((val: any) => {
        if (val.result && val.result.content) {
          val.result.content.forEach(element => this.updateCardData(element));
        }
        return val.result;
      }));
  }

  updateCardData(content) {
    content.cardImg =  content.appIcon || content.courseLogoUrl || content.cardImg || 'assets/images/book.png';
    return content;
   }
}
