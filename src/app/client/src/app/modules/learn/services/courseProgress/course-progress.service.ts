import { of as observableOf, Observable, of } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { ConfigService, ServerResponse, ToasterService, ResourceService } from '@sunbird/shared';
import { ContentService, UserService, CoursesService } from '@sunbird/core';
import * as _ from 'lodash-es';
import dayjs from 'dayjs';

@Injectable({
  providedIn: 'root'
})
export class CourseProgressService {
  /**
 * Reference of content service.
 */
  public contentService: ContentService;

  /**
   * Reference of config service
   */
  public configService: ConfigService;

  public courseProgress: any = {};

  public userService: UserService;
  completionPercentage: any = 0;
  progressdetails: any = {};
  mimeType: string = '';

  /**
  * An event emitter to emit course progress data from a service.
  */
  courseProgressData: EventEmitter<any> = new EventEmitter();


  constructor(contentService: ContentService, configService: ConfigService,
    userService: UserService, public coursesService: CoursesService, private toasterService: ToasterService,
    private resourceService: ResourceService) {
    this.contentService = contentService;
    this.configService = configService;
    this.userService = userService;
  }

  /**
  * method to get content status
  */
  public getContentState(req) {
    const courseId_batchId = req.courseId + '_' + req.batchId;
      const channelOptions = {
        url: this.configService.urlConFig.URLS.COURSE.USER_CONTENT_STATE_READ,
        data: {
          request: {
            userId: req.userId,
            courseId: req.courseId,
            contentIds: req.contentIds,
            batchId: req.batchId
          }
        }
      };
      if (_.get(req, 'fields')) {
        channelOptions.data.request['fields'] = _.get(req, 'fields');
      }
      return this.contentService.post(channelOptions).pipe(map((res: ServerResponse) => {
        this.processContent(req, res, courseId_batchId);
        this.courseProgressData.emit(this.courseProgress[courseId_batchId]);
        return this.courseProgress[courseId_batchId];
      }), catchError((err) => {
        this.courseProgressData.emit({ lastPlayedContentId: req.contentIds[0] });
        return err;
      }));
  }

  public getContentProgressState(req, res) {
    const courseId_batchId = req.courseId + '_' + req.batchId;
    this.processContent(req, res, courseId_batchId, true);
    this.courseProgressData.emit(this.courseProgress[courseId_batchId]);
    return this.courseProgress[courseId_batchId];
  }

  private processContent(req, res, courseId_batchId, isCSLResponse: boolean = false) {
    let _contentList = _.get(res, 'result.contentList');
    if (isCSLResponse) {
      _contentList = res;
    }
    this.courseProgress[courseId_batchId] = {
      progress: 0,
      completedCount: 0,
      totalCount: _.uniq(req.contentIds).length,
      content: []
    };
    const resContentIds = [];
    if (_contentList.length > 0) {
      _.forEach(_.uniq(req.contentIds), (contentId) => {
        const content = _.find(_contentList, { 'contentId': contentId });
        if (content) {
          this.courseProgress[courseId_batchId].content.push(content);
          resContentIds.push(content.contentId);
        } else {
          this.courseProgress[courseId_batchId].content.push({
            'contentId': contentId,
            'status': 0,
            'courseId': req.courseId,
            'batchId': req.batchId,
          });
        }
      });
      this.calculateProgress(courseId_batchId);
    } else {
      _.forEach(req.contentIds, (value, key) => {
        this.courseProgress[courseId_batchId].content.push({
          'contentId': value,
          'status': 0,
          'courseId': req.courseId,
          'batchId': req.batchId,
        });
      });
      this.courseProgress[courseId_batchId].lastPlayedContentId = req.contentIds[0];
    }
  }

  private calculateProgress(courseId_batchId) {
    const lastAccessTimeOfContentId = [];
    let completedCount = 0;
    const contentList = this.courseProgress[courseId_batchId].content;
    _.forEach(contentList, (content) => {
      if (content.status === 2) {
        completedCount += 1;
      }
      if (content.lastAccessTime) {
        lastAccessTimeOfContentId.push(content.lastAccessTime);
      }
    });
    this.courseProgress[courseId_batchId].completedCount = completedCount;
    const progress = ((this.courseProgress[courseId_batchId].completedCount / this.courseProgress[courseId_batchId].totalCount) * 100);
    this.courseProgress[courseId_batchId].progress = progress > 100 ? 100 : progress;
    const index = _.findIndex(contentList, { lastAccessTime: lastAccessTimeOfContentId.sort().reverse()[0] });
    const lastPlayedContent = contentList[index] ? contentList[index] : contentList[0];
    this.courseProgress[courseId_batchId].lastPlayedContentId = lastPlayedContent && lastPlayedContent.contentId;
  }

  public updateContentsState(req) {
    const courseId_batchId = req.courseId + '_' + req.batchId;
    const courseProgress = this.courseProgress[courseId_batchId];
    if (courseProgress && req.contentId && req.status) {
      const index = _.findIndex(courseProgress.content, { 'contentId': req.contentId });
      if (index !== -1 && req.status >= courseProgress.content[index].status
        && courseProgress.content[index].status !== 2) {
        courseProgress.content[index].status = req.status;
        return this.updateContentStateToServer(courseProgress.content[index]).pipe(
          map((res: any) => {
            this.courseProgress[courseId_batchId].content[index].status = req.status;
            this.courseProgress[courseId_batchId].content[index].lastAccessTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss:SSSZZ');
            this.calculateProgress(courseId_batchId);
            this.courseProgressData.emit(this.courseProgress[courseId_batchId]);
            this.coursesService.updateCourseProgress(req.courseId, req.batchId, this.courseProgress[courseId_batchId].completedCount);
            return this.courseProgress[courseId_batchId];
          }));
      } else {
        return observableOf(this.courseProgress[courseId_batchId]);
      }
    } else {
      return observableOf(this.courseProgress[courseId_batchId]);
    }
  }
  /**
   * to make api call to server
   */
  updateContentStateToServer(data) {
    let req;
    if(this.mimeType !== 'application/vnd.sunbird.questionset') {
      req = {
        contentId: data.contentId,
        batchId: data.batchId,
        status: data.status,
        courseId: data.courseId,
        lastAccessTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss:SSSZZ')
      };
      req['completionPercentage'] = this.completionPercentage;
      req['progressdetails'] = this.progressdetails;
    } else {
      req = {
        contentId: data.contentId,
        batchId: data.batchId,
        status: data.status,
        courseId: data.courseId,
        lastAccessTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss:SSSZZ')
      };
    }
    const channelOptions = {
      url: this.configService.urlConFig.URLS.COURSE.USER_CONTENT_STATE_UPDATE,
      data: {
        request: {
          userId: this.userService.userid,
          contents: [req]
        }
      }
    };
    return this.contentService.patch(channelOptions)
      .pipe(map((updateCourseStatesData: any) => ({ updateCourseStatesData })));
  }

  sendAssessment(data): Observable<any> {
    const channelOptions = {
      url: this.configService.urlConFig.URLS.COURSE.USER_CONTENT_STATE_UPDATE,
      data: _.get(data, 'requestBody')
    };
    return _.get(data, 'methodType') === 'PATCH' && this.contentService.patch(channelOptions).pipe(
      retry(1),
      catchError(err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
        return of(err);
      })
    );
  }

  setmimeType(type) {
    this.mimeType = type;
  }

  // endEventData(event: any) {
  //   let telemetryEvent = _.get(event, 'detail.telemetryData');
  //   if(telemetryEvent?.eid == "END") {
  //     let edata = telemetryEvent?.edata;
  //     edata?.summary?.forEach((val: any) => {
  //       if(val?.progress) {
  //         this.completionPercentage = val.progress
  //       }
  //       if(val?.totallength) {
  //         this.progressdetails['max_size'] = val.totallength;
  //       }
  //       if(val?.visitedlength) {
  //         this.progressdetails['current'] = [];
  //         if(this.mimeType == 'application/pdf') {
  //           let count = 1;
  //           while(val.visitedlength > 0) {
  //             this.progressdetails['current'].push(count)
  //             count++;
  //             val.visitedlength--;
  //           }
  //         } else {
  //           this.progressdetails['current'].push(val.visitedlength);
  //         }
  //       }
  //     });

  //     console.log("progressdetails", this.progressdetails);
  //   }
  // }


    endEventData(event: any) {
      if(this.mimeType !== 'application/vnd.sunbird.questionset') {
        if(event?.eid == "END") {
          let edata = _.get(event, 'edata');
          if(edata?.currentPage && edata?.totalPages) {
            this.completionPercentage = this.calculateCompletedPercentage(edata.currentPage, edata.totalPages);
            this.progressdetails['max_size'] = edata.totalPages;
            let count = 1;
            this.progressdetails['current'] = [];
            while(edata.currentPage > 0) {
              this.progressdetails['current'].push(count)
              count++;
              edata.currentPage--;
            }
          } else if(edata?.currentTime && edata?.totalTime) {
            this.completionPercentage = this.calculateCompletedPercentage(edata.currentTime, edata.totalTime);
            this.progressdetails['max_size'] = edata.totalTime;
            this.progressdetails['current'] = [];
            this.progressdetails['current'].push(edata.currentTime);
          }
          console.log("progressdetails", this.progressdetails);
        }
      }
    }

    calculateCompletedPercentage(completed: any, total: any) {
      let percentage: any;

      percentage = (completed / total) * 100

      return Math.ceil(percentage) > 98 ? 100 : Math.ceil(percentage);
    }
}
