import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '@sunbird/shared';
import * as publicService from '../../services';
import { SearchService } from './../../../core/services/search/search.service';
import { ResourceService } from '@sunbird/shared';
import { CoursesService } from '@sunbird/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  configContent: any = {}
  // CAROUSEL_BREAKPOINT = 768;
  CAROUSEL_BREAKPOINT = 1400;
  carouselDisplayMode = 'multiple';
  courses: any = {};

  layoutConfiguration;

  constructor(public layoutService: LayoutService, private landingPageContentService: publicService.LandingPageContentService, 
    public search: SearchService, private router: Router, public resourceService: ResourceService, private coursesService: CoursesService) { }

  ngOnInit() {
    // alert()
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.landingPageContentService.getPageContent().subscribe(res => {
      this.configContent = res;
    })
    // this.search.compositeSearch({}).subscribe(res => {
    //   this.courses = res;
    //   console.log('Courses', this.courses);
    // })
    let requestData = {
      "request": {
        "filters": {
          "primaryCategory": ["Course"],
          "visibility": ["Default","Parent"]
        },
        "limit": 12,
        "sort_by": {
          "lastPublishedOn": "desc"
        },
        "fields": ["name","appIcon","posterImage","mimeType","identifier","pkgVersion","resourceType","primaryCategory","contentType","channel","organisation","trackable"],
        "offset": 0
      }
    };
    this.coursesService.getCourses(requestData).subscribe(res => {
      this.courses = res["result"]["content"];
      // console.log('Courses', this.courses);
    })
  }

  slideConfig = { slidesToShow: 3, slidesToScroll: 3 };

  slickInit(e: any) {
    // console.log('slick initialized');
  }

  breakpoint(e: any) {
    // console.log('breakpoint');
  }

  afterChange(e: any) {
    // console.log('afterChange');
  }
  
  beforeChange(e: any) {
    // console.log('beforeChange');
  }

  loginClick = () => {
    window.location.href = '/resources';
  }

  registerClick = () => {
    this.router.navigateByUrl('/signup')
  }

  doJsonDecode = (data: any) => {
    return JSON.parse(data);
  }

}