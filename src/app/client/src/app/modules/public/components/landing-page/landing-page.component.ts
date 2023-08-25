import { Component, OnInit, HostListener } from '@angular/core';
import { LayoutService } from '@sunbird/shared';
import * as publicService from '../../services';
import { SearchService } from './../../../core/services/search/search.service';

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
  environment = {
    url: 'https://compass-dev.tarento.com/',
    authToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0WEFsdFpGMFFhc1JDYlFnVXB4b2RvU2tLRUZyWmdpdCJ9.mXD7cSvv3Le6o_32lJplDck2D0IIMHnv0uJKq98YVwk',
  }
  taxonomyConfig = {
        "frameworkId" :"compass_fw",
        "config" : [
            {   
                "index": 1,
                "category": "board",
                "icon": "settings",
                "color": "#1d2327"
            },
            {   
                "index": 2,
                "category": "medium",
                "icon": "extension",
                "color": "#541675"
            },
            {   
                "index": 3,
                "category": "subject",
                "icon": "bar_chart",
                "color": "#9a6c80"
            },
            {   
                "index": 4,
                "category": "gradeLevel",
                "icon": "account_box",
                "color": "#d8666a"
            }
        ]
    };
    
  layoutConfiguration;

  constructor(public layoutService: LayoutService, private landingPageContentService: publicService.LandingPageContentService, public search: SearchService) { }

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
          "channel": "0138193046778920963",
          "primaryCategory": [
            "Collection",
            "Resource",
            "Content Playlist",
            "Course",
            "Course Assessment",
            "Digital Textbook",
            "eTextbook",
            "Explanation Content",
            "Learning Resource",
            "Lesson Plan Unit",
            "Practice Question Set",
            "Teacher Resource",
            "Textbook Unit",
            "LessonPlan",
            "FocusSpot",
            "Learning Outcome Definition",
            "Curiosity Questions",
            "MarkingSchemeRubric",
            "ExplanationResource",
            "ExperientialResource",
            "Practice Resource",
            "TVLesson",
            "Course Unit"
          ],
          "visibility": [
            "Default",
            "Parent"
          ]
        },
        "limit": 100,
        "sort_by": {
          "lastPublishedOn": "desc"
        },
        "fields": [
          "name",
          "appIcon",
          "mimeType",
          "gradeLevel",
          "identifier",
          "medium",
          "pkgVersion",
          "board",
          "subject",
          "resourceType",
          "primaryCategory",
          "contentType",
          "channel",
          "organisation",
          "trackable"
        ],
        "softConstraints": {
          "badgeAssertions": 98,
          "channel": 100
        },
        "mode": "soft",
        "facets": [
          "se_boards",
          "se_gradeLevels",
          "se_subjects",
          "se_mediums",
          "primaryCategory"
        ],
        "offset": 0
      }
    };
    this.landingPageContentService.getCourses(requestData).subscribe(res => {
      this.courses = res["result"]["content"];
      console.log('Courses', this.courses);
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

}