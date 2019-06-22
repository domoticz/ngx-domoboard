import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { DeviceOptionsService } from '@nd/core/services';
import { Temp, Switch } from '@nd/core/models';

@Component({
  selector: 'nd-device-options',
  template: `
    <div *ngIf="(device$ | async) as device" class="options-container">
      <nb-icon class="close-icon" icon="close-outline"
        (click)="onCloseClick()">
      </nb-icon>
      <input nbInput type="text" class="form-control" placeholder="{{ device.Name }}">
    </div>
  `,
  styleUrls: ['./device-options.component.scss']
})
export class DeviceOptionsComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  device$: Observable<Temp | Switch> = this.service.select<Temp | Switch>('device');

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private service: DeviceOptionsService<Temp | Switch>
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.service.getDevice(params.get('idx'))),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  onCloseClick() {
    this.location.back();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
