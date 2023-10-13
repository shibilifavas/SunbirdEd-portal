import { Component, OnInit } from '@angular/core';
import { SearchService, SchemaService } from '@sunbird/core';
import { ResourceService } from '@sunbird/shared';
import { ContentSearchService } from '@sunbird/content-search';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subject, of, Observable } from 'rxjs';
import { takeUntil, map, delay, debounceTime, tap, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-courses-search',
  templateUrl: './courses-search.component.html',
  styleUrls: ['./courses-search.component.scss']
})
export class CoursesSearchComponent implements OnInit {
  breadCrumbData = [];
  courses = [];
  public unsubscribe$ = new Subject<void>();

  constructor(public activatedRoute: ActivatedRoute, public searchService: SearchService, 
    public resourceService: ResourceService, private schemaService: SchemaService, private contentSearchService: ContentSearchService) { }

  ngOnInit(): void {
    this.breadCrumbData = [
      {
        "label": "Learn",
        "icon": "school",
        "status": "inactive",
        "link": "resources"
      },
      {
        "label": "Search",
        "status": "active",
        "icon": "search",
        "link": ""
      }
    ];
    this.fetchContentOnParamChange();
  }

  private fetchContentOnParamChange() {
    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams, this.schemaService.fetchSchemas())
      .pipe(debounceTime(5),
        map((result) => ({ params: { pageNumber: Number(result[0].pageNumber) }, queryParams: result[1] })),
        takeUntil(this.unsubscribe$))
      .subscribe(({ params, queryParams }) => {
        console.log(params, queryParams);
        this.fetchContents(params.pageNumber, queryParams.channel, queryParams.key, queryParams.competency, queryParams.keyword);
      });
  }

  public fetchContents(pageNumber, channelId, key, competency, keyword) {
    const option = {
      filters: { 
        primaryCategory: ["Course", "Course Assessment"], 
        visibility: ["Default", "Parent"], 
        channel: channelId ,
        keywords: keyword ?? '',
        targetTaxonomyCategory4Ids: [
          competency ?? ''
        ]
      },
      targetTaxonomyCategory4Ids: [
        competency ?? ''
      ],
      query: key ?? '',
      sort_by: { lastPublishedOn: 'desc' },
      pageNumber: pageNumber
    };
    if(option.filters.keywords == ''){
      delete option.filters.keywords;
    }
    if(option.filters.targetTaxonomyCategory4Ids[0]==''){
      delete option.filters.targetTaxonomyCategory4Ids;
    }
    this.searchService.contentSearch(option).subscribe(res => {
      this.courses = res['result']['content'];
      this.courses = this.contentSearchService.updateCourseWithTaggedCompetency(this.courses);
      // console.log('Searched Courses', res['result']['content']);
    });
  }

}
