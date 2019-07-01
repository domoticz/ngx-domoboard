import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, finalize, take } from 'rxjs/operators';

import { DeviceOptionsService, DBService } from '@nd/core/services';
import { Temp, Switch, DomoticzSettings } from '@nd/core/models';

@Component({
  selector: 'nd-device-options',
  template: `
    <div *ngIf="(device$ | async) as device" class="options-container">
      <nb-icon class="close-icon" icon="close-outline"
        (click)="onCloseClick()">
      </nb-icon>
      <nd-name [device]="device$ | async" [loading]="renameLoading"
        (nameClick)="onRenameClick($event)">
      </nd-name>
      <nd-notifications [device]="device$ | async" [settings]="settings$ | async">
      </nd-notifications>
    </div>
  `,
  styleUrls: ['./device-options.component.scss']
})
export class DeviceOptionsComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  device$: Observable<Temp | Switch> = this.service.select<Temp | Switch>('device');

  settings$: Observable<DomoticzSettings> = this.dbService.store;

  renameLoading: boolean;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private service: DeviceOptionsService<Temp | Switch>,
    private dbService: DBService
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

  onRenameClick(device: Temp | Switch) {
    this.renameLoading = true;
    this.service.renameDevice(device.idx, device.Name).pipe(
      take(1),
      finalize(() => this.renameLoading = false),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.service.clearStore();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
