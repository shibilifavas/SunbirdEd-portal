import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-whishlist-courses',
  templateUrl: './whishlist-courses.component.html',
  styleUrls: ['./whishlist-courses.component.scss']
})
export class WhishlistCoursesComponent implements OnInit {
  breadCrumbData = [];

  constructor() { }

  ngOnInit(): void {
    this.breadCrumbData = [
      {
        "label": "Learn",
        "status": "inactive",
        "icon": "school",
        "link": "resources"
      },
      {
        "label": "Whishlist",
        "status": "active",
        "icon": "favorite",
        "link": ""
      }
    ];
  }
}
