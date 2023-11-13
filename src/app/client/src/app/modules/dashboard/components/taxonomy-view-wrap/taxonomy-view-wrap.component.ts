import { Component, OnInit } from '@angular/core';
import { taxonomyEnvironment, taxonomyConfig } from '../../../../framework.config';
import { TaxonomyService } from '../../../../service/taxonomy.service';

@Component({
  selector: 'app-taxonomy-view-wrap',
  templateUrl: './taxonomy-view-wrap.component.html',
  styleUrls: ['./taxonomy-view-wrap.component.scss']
})

export class TaxonomyViewWrapComponent implements OnInit {
  environment = taxonomyEnvironment;
  taxonomyConfig = taxonomyConfig;
  loading = false;
  constructor(private taxonomyService: TaxonomyService) { }

  ngOnInit(): void {
    localStorage.removeItem('environment');
    this.taxonomyService.getPortalToken().subscribe((res) => {
      this.environment.authToken = 'Bearer ' + res;
      this.loading = true;
      localStorage.setItem('environment', JSON.stringify(this.environment));
    });
  }
}
