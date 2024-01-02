import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-competency-passbook',
  templateUrl: './competency-passbook.component.html',
  styleUrls: ['./competency-passbook.component.scss']
})
export class CompetencyPassbookComponent implements OnInit {
  public sanitizedUrl: SafeResourceUrl;

  breadCrumbData: any = [
    {
      "label": "Learn",
      "status": "inactive",
      "link": "resources",
      "icon": "school"
    },
    {
      "label": "Competency passbook",
      "status": "active",
      "link": "",
      "icon": "extension"
    }
  ];
  constructor(private sanitizer: DomSanitizer) {
    const url = `https://compass.samagra.io?userId=${localStorage.getItem('userId')}`;
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
   }

  ngOnInit(): void {}

}
