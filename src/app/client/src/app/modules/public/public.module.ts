import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { LandingPageComponent } from './components';
import { PublicPlayerService, LandingpageGuard, PendingchangesGuard } from './services';
import { SharedModule } from '@sunbird/shared';
import { PublicRoutingModule } from './public-routing.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import {CardModule} from 'compass-common-consumption';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { LoginPageComponent } from './components/login-page/login-page.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    CardModule,
    PublicRoutingModule,
    SlickCarouselModule
  ],
  declarations: [LandingPageComponent, LoginPageComponent,
    ],
  providers: [PublicPlayerService, DeviceDetectorService, LandingpageGuard, PendingchangesGuard]
})
export class PublicModule { }
