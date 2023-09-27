import { Component, Input, OnInit, Inject, SimpleChange, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash-es';
import { CourseConsumptionService, CourseProgressService } from '../../../services';
import { CoursesService, UserService } from '@sunbird/core';
import { CsCourseService } from '@project-sunbird/client-services/services/course/interface';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-course-aside',
  templateUrl: './course-aside.component.html',
  styleUrls: ['./course-aside.component.scss']
})
export class CourseAsideComponent implements OnInit {
  @Input() courseHierarchy:any;
  @Input() configContent:any;
  @Input() params: any;
  firstContentId: any;
  parentId: any;
  batchId: any;

  constructor(private router: Router, private courseConsumptionService: CourseConsumptionService) { }

  ngOnInit(): void {
    const firstModule = this.courseConsumptionService.getCourseContent()[0];
    this.firstContentId = firstModule.body[0].selectedContent;
    this.parentId = firstModule.body[0].collectionId;
    console.log("firstModule", firstModule);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes?.params.currentValue) {
      this.batchId = changes.params.currentValue;
    }
  }

  navigate() {
    console.log("firstContentId", this.firstContentId);
    console.log("batchId", this.batchId);
    // this.router.navigate(['/learn/course/play',this.courseHierarchy.identifier]);
    this.router.navigate(['/learn/course/play',this.courseHierarchy.identifier],
    { 
      queryParams: { 
        batchId: this.batchId,
        courseId: this.courseHierarchy.identifier,
        courseName: this.courseHierarchy.name,
        selectedContent: this.firstContentId,
        parent: this.parentId
      } 
    });
  }
}
