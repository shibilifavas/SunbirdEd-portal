import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'course-discussion-forum',
  templateUrl: './course-discussion-forum.component.html',
  styleUrls: ['./course-discussion-forum.component.scss']
})
export class CourseDiscussionForumComponent implements OnInit {
  @Input() courseDetails: any;
  @Input() configContent: any;
  discussionText:string = '';
  postText:string = '';
  searchText:string = '';
  fields = ['Popular', 'Recently posted'];
  selectedField = 'Recently posted';
  writeComment = false;

  constructor() { }

  ngOnInit(): void {
  }

}
