import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-course-content',
  templateUrl: './course-content.component.html',
  styleUrls: ['./course-content.component.scss']
})
export class CourseContentComponent implements OnInit {
  @Input() courseDetails: any;
  @Input() configContent: any;
  @Input() params: any;
  @Input() tocList = [];
  @Output() contentClicked = new EventEmitter<any>();
  
  constructor() { }

  ngOnInit(): void {
  }
  contentClick(event){
    this.contentClicked.emit(event)
  }
}
