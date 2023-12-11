import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseBatchService } from '../../services';
import { UserService } from '@sunbird/core';
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
  displayColumns = ['initials', 'name', 'designation', 'enrolledDate','progress', 'link'];
  breadCrumbData = [];
  search:string;
  startDate = '';
  endDate = '';
  showDatedropdown = false;
  statusList = ['All members', 'Completed', 'Not started'];
  status = new FormControl('');
  constructor(private route: ActivatedRoute, private courseBatchService: CourseBatchService,
    private userSerivce: UserService, private httpClient: HttpClient) {
   }

  ngOnInit(): void {
    this.memberList = [
      // {
      //   id:'12121',
      //   initials:'AB',
      //   name:'Anand Bhavan',
      //   designation:'Teacher',
      //   enrolledDate:new Date('2023-07-11 04:56:35:501+0000').toLocaleDateString(),
      //   progress:80,
      //   link:{path:'', text:'profile'}
      // }
    ];
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
                    initials:m.firstName[0]+m.lastName[0]||'',
                    name: m.firstName+' '+m.lastName,
                    designation:m.userType,
                    enrolledDate: new Date(m.updatedDate).toLocaleDateString(),
                    progress: 80,
                    link:{path:'/', text:'Profile'}
                  }
                })
          }
        })
     }
    })
  }

  onPageChange(e){
    console.log(e);
  }
  onSelect(event){
    console.log(event);
  }
}