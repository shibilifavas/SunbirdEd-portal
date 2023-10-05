import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'compass-breadcrumb',
  templateUrl: './compass-breadcrumb.component.html',
  styleUrls: ['./compass-breadcrumb.component.scss']
})
export class CompassBreadcrumbComponent implements OnInit {

  @Input() data: [];
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    // console.log('BC', this.data);
  }

  navigateTo(link: string) {
    if (link !== "") {
      this.router.navigateByUrl(link);
    }
    return;
  }

}
