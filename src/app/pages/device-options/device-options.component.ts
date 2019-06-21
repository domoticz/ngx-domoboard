import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { tap } from 'rxjs/operators';

@Component({
  selector: 'nd-device-options',
  template: `
    <div class="options-container">
      <nb-icon class="close-icon" icon="close-outline"
        (click)="onCloseClick()">
      </nb-icon>
    </div>
  `,
  styleUrls: ['./device-options.component.scss']
})
export class DeviceOptionsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      tap((params: ParamMap) => console.log('id: ' + params.get('idx')))
    ).subscribe();
  }

  onCloseClick() {
    this.location.back();
  }

}
