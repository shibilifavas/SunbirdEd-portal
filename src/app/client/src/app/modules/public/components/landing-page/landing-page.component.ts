import { Component, OnInit, HostListener } from '@angular/core';
import { LayoutService } from '@sunbird/shared';
import * as publicService from '../../services';
import {SearchService} from './../../../core/services/search/search.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  configContent:any = {}
  CAROUSEL_BREAKPOINT = 768;
  carouselDisplayMode = 'multiple';
  courses:any = {};
  
  layoutConfiguration;

  constructor(public layoutService: LayoutService, private landingPageContentService:publicService.LandingPageContentService, public search: SearchService) { }

  ngOnInit() {
    // alert()
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.landingPageContentService.getPageContent().subscribe(res => {
      this.configContent = res;
    })
    this.search.compositeSearch({}).subscribe(res => {
      this.courses = res;
      console.log('Courses', this.courses);
    })
  }

  slideConfig = { slidesToShow: 3, slidesToScroll: 3 };

  slickInit(e: any) {
    console.log('slick initialized');
  }
  breakpoint(e: any) {
    console.log('breakpoint');
  }
  afterChange(e: any) {
    console.log('afterChange');
  }
  beforeChange(e: any) {
    console.log('beforeChange');
  }

}
