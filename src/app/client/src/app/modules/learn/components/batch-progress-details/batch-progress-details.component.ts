import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseBatchService } from '../../services';
import { UserService, PublicDataService, LearnerService} from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { FormControl } from '@angular/forms';

export interface CourseData {
  id: string;
  initials:string;
  name: string;
  designation:string;
  enrolledData: string;
  progress: number;
  link: any;
}

@Component({
  selector: 'app-batch-progress-details',
  templateUrl: './batch-progress-details.component.html',
  styleUrls: ['./batch-progress-details.component.scss']
})
export class BatchProgressDetailsComponent implements OnInit {
  courseDetails: any = {};
  memberList: any[];
  authToken : [];
  displayColumns = ['initials', 'name', 'designation', 'department','progress', 'link'];
  breadCrumbData = [];
  search:string;
  startDate = new FormControl();
  endDate = new FormControl();
  showDatedropdown = false;
  statusList = ['All members', 'Completed', 'Not started'];
  status = new FormControl('');
  dateRange;

  constructor(private route: ActivatedRoute, 
    private courseBatchService: CourseBatchService, 
    private publicDataService: PublicDataService,
    private learnerService: LearnerService,
    private configService: ConfigService,
    private userSerivce: UserService, private httpClient: HttpClient) {
   }

  ngOnInit(): void {
    this.memberList = [];
   this.route.queryParamMap.subscribe((pa:any) => {
      this.courseDetails.name = pa.params.name;
      this.breadCrumbData.push({
        label: this.courseDetails.name,
        "status": "active",
        "icon": "list",
        "link": "/learn/batch-progress"
      })
    });
    this.route.params.subscribe(param => {
      this.courseDetails.id = param.courseId;
      this.courseDetails.batchId = param.batchId;
      this.getBatchParticipentList();
    });
  }

  getBatchParticipentList(){
    const req = {
      request: {
          batch: {
              "batchId": this.courseDetails.batchId
          }
      }
    }
    this.courseBatchService.getParticipantList(req).subscribe((res:any) => {
      console.log(res);
     if(res.length>0) {
        const requestBody =  {
          request: {
            filters: {
                userId: [
                    ...res
                ]
              }
          }
        }
        this.userSerivce.getEnrolledUsers(requestBody).subscribe((memResponse:any) => {
              if(memResponse.length>0) {
                this.memberList = memResponse.map((m:any) => {
                  return {
                    initials:`${m.firstName[0]}${m.lastName[0] ? m.lastName[0] : ''}`,
                    name: m.firstName+' '+m.lastName,
                    designation:m.profileDetails!==null?m.profileDetails.professionalDetails[0].designation : '',
                    department:m.profileDetails !== null?m.profileDetails.employmentDetails.departmentName : '',
                    progress: 80,
                    link:{path:'/profile', text:'profile'}
                  }
                })
                 // progress: courseList.filters(course => course.identifier === this.courseDetails.id && course.userId === m.id)[0].completionPercentage,
              this.updateProgress(res,memResponse);
             }
        })
     }
    })
  }

  updateProgress(res, memResponse){
    let updatedMemberList = [];
    const option = {
      url: this.configService.urlConFig.URLS.COURSE.COURSE_USERS,
      data: { 
        request: {
          filters: {
            "courseIds": [this.courseDetails.id],
           },
           "userIds": [...res]
        }
      }
    }
    this.learnerService.post(option).subscribe((courseList:any) => {
        updatedMemberList = memResponse.map((m:any) => {
            const perValue = courseList.result.courses.filter((cos:any) => {
               if(cos.courseId === this.courseDetails.id && cos.userId === m.id) {
                return cos;
               }
            });
      
            return {
              initials:`${m.firstName[0]}${m.lastName[0] ? m.lastName[0] : ''}`,
              name: m.firstName+' '+m.lastName,
              designation:m.profileDetails!==null?m.profileDetails.professionalDetails[0].designation : '',
              department:m.profileDetails !== null?m.profileDetails.employmentDetails.departmentName : '',
              progress:perValue.length>0?perValue[0].completionPercentage:0,
              link:{path:'/profile', text:'profile'}
            }
          });
          this.memberList = [...updatedMemberList];
    });
  }

  OnDateChange(e){
    console.log(this.startDate.value.format('DD/MM/yyyy'));
    console.log(this.endDate.value.format('DD/MM/yyyy'));
  }

  onPageChange(e){
    console.log(e);
  }

  onSelect(event){
    console.log(event);
  }


  bulkDateFilter(data) {
    switch(data){
      case 'today': let dateRange = new Date().toUTCString();
                    console.log(new Date(dateRange).toLocaleDateString());
                      break;
      case 'tomorrow': let currentDate = new Date().toUTCString();
                       let dateR = new Date(currentDate).setDate(new Date(currentDate).getDate()+1);
                       console.log(new Date(dateR).toLocaleDateString());
                       break;
      case 'current-month': console.log(this.convertpastDate(0))
                            break;
      case 'past-month': console.log(this.convertpastDate(1))
                          break;
      case 'past-3-month': console.log(this.convertpastDate(3))
                          break;
      default:break;
    }
  }

  convertpastDate(numberofMonth) {
    let date = new Date(), y = date.getFullYear(), m = date.getMonth();
    let firstDay = new Date(y, m - numberofMonth, 1);
    let lastDay = new Date(y, m, 0);
    return {firstDay:firstDay, lastDay: lastDay};
  }

}
