import { Component, Input, OnInit, Inject, SimpleChange, SimpleChanges, Output, EventEmitter } from '@angular/core';
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
  courseStatus:number;
  resumeContent: any;
  courseContent: any;

  constructor(private router: Router, private courseConsumptionService: CourseConsumptionService,
     private userService: UserService,  public courseProgressService: CourseProgressService) { }

  ngOnInit(): void {
    this.courseContent = this.courseConsumptionService.getCourseContent();
    this.resumeContent = this.courseContent[0].body[0].selectedContent;
    this.parentId = this.courseContent[0].body[0].collectionId;

    this.courseProgressService.courseStatus.subscribe((status:number) => {
      this.courseStatus = status
    });

    //set selected content Id with last visited contentId
    this.courseProgressService.getLastReadContent().subscribe((resumeContent: any) => {
      if(resumeContent !== '' && resumeContent) {
        this.courseContent.forEach((resource:any) => {
          resource.body.forEach((content: any) => {
            if(content.selectedContent == resumeContent) {
              this.parentId = content.collectionId;
              this.resumeContent = content.selectedContent;
            }
          })
        })
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes?.params?.currentValue) {
      this.batchId = changes.params.currentValue;
    }
  }

  navigate() {
    // this.router.navigate(['/learn/course/play',this.courseHierarchy.identifier]);
    if(!this.courseConsumptionService.isUserExistInBatch()){
      this.courseConsumptionService.enrollToCourse(this.courseHierarchy);
    }
    this.router.navigate(['/learn/course/play',this.parentId],
    { 
      queryParams: { 
        batchId: this.batchId || this.courseConsumptionService.getBatchId(),
        courseId: this.courseHierarchy.identifier,
        courseName: this.courseHierarchy.name,
        selectedContent: this.resumeContent,
        parent: this.parentId
      } 
    });
  }
}
