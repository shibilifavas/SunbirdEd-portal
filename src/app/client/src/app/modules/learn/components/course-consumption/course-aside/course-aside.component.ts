import { Component, Input, OnInit, Inject, SimpleChange, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash-es';
import { CourseConsumptionService, CourseProgressService } from '../../../services';
import { CoursesService, UserService } from '@sunbird/core';
import { CsCourseService } from '@project-sunbird/client-services/services/course/interface';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {ResourceService, ToasterService} from '@sunbird/shared';
import { CsCertificateService } from '@project-sunbird/client-services/services/certificate/interface';
import { CertificateDownloadAsPdfService } from 'sb-svg2pdf-v13';

@Component({
  selector: 'app-course-aside',
  templateUrl: './course-aside.component.html',
  styleUrls: ['./course-aside.component.scss'],
  providers: [CertificateDownloadAsPdfService]
})
export class CourseAsideComponent implements OnInit {
  @Input() courseHierarchy:any;
  @Input() configContent:any;
  @Input() params: any;

  firstContentId: any;
  parentId: any;
  batchId: any;
  courseStatus:number;
  public unsubscribe$ = new Subject<void>();

  constructor(private router: Router, private courseConsumptionService: CourseConsumptionService,
     private userService: UserService,  public courseProgressService: CourseProgressService, public resourceService: ResourceService, public toasterService: ToasterService,
     private certDownloadAsPdf: CertificateDownloadAsPdfService, @Inject('CS_CERTIFICATE_SERVICE') private CsCertificateService: CsCertificateService) { }

  ngOnInit(): void {
    const firstModule = this.courseConsumptionService.getCourseContent()[0];
    // console.log(firstModule);
    this.firstContentId = firstModule.body[0].selectedContent;
    this.parentId = firstModule.body[0].collectionId;
    this.courseProgressService.courseStatus.subscribe((status:number) => {
      this.courseStatus = status
      // this.courseStatus = 2
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes?.params?.currentValue) {
      this.batchId = changes.params.currentValue;
    }
  }

  downloadOldAndRCCert(courseObj) {
    // alert('downloadOldAndRCCert');
    let requestBody = {
      certificateId: courseObj.id,
      schemaName: 'certificate',
      type: courseObj.type,
      templateUrl: courseObj.templateUrl
    };
    this.CsCertificateService.getCerificateDownloadURI(requestBody, {
      apiPath: '/learner/certreg/v2',
      apiPathLegacy: '/certreg/v1',
      rcApiPath: '/learner/rc/${schemaName}/v1',
    })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        if (_.get(resp, 'printUri')) {
          this.certDownloadAsPdf.download(resp.printUri, null, courseObj.trainingName);
        } else {
          this.toasterService.error(this.resourceService.messages.emsg.m0076);
        }
      }, error => {
        console.log('Portal :: CSL : Download certificate CSL API failed ', error);
      });
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
        selectedContent: this.firstContentId,
        parent: this.parentId
      } 
    });
  }

  saveCourseRating(courseId: string) {
    let data: any = {
      activityId: this.courseHierarchy.identifier,
      userId: "1fc08c1b-39bb-4b53-a25d-12bf9ef99e4f",
      activityType: "Course",
      rating: 4,
      review: "good course"
  };
    this.courseConsumptionService.saveCourseRating(data).subscribe((res: any) => {
      // console.log('Rating', res);
    
    });
  }
}
