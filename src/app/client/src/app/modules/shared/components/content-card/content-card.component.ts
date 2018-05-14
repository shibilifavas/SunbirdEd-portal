import { IContents } from './../../interfaces';
import { ResourceService } from '../../services/index';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
/**
* This display a content card
*/
@Component({
  selector: 'app-content-card',
  templateUrl: './content-card.component.html',
  styleUrls: ['./content-card.component.css']
})
export class ContentCardComponent implements OnInit {
  /**
  * content is used to render IContents value on the view
  */
  @Input() content: IContents;
  @Output('clickEvent')
  clickEvent = new EventEmitter<any>();
  ngOnInit() {
  }
  public onAction(content, actionType) {
    this.clickEvent.emit({ 'type': actionType, 'content': content });
  }
}
