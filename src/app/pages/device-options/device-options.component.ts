import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, finalize, take, delay } from 'rxjs/operators';

import { DeviceOptionsService } from '@nd/core/services';
import { Temp, Switch } from '@nd/core/models';

@Component({
  selector: 'nd-device-options',
  template: `
    <div *ngIf="(device$ | async) as device" class="options-container">
      <nb-icon class="close-icon" icon="close-outline"
        (click)="onCloseClick()">
      </nb-icon>
      <div class="name-form-container">
        <div class="name-form" [nbSpinner]="renameLoading">
          <input class="name-input" nbInput type="text" [(ngModel)]="device.Name">
          <button class="name-btn" nbButton status="primary" (click)="onRenameClick(device.idx, device.Name)">
            <nb-icon icon="checkmark-outline"></nb-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./device-options.component.scss']
})
export class DeviceOptionsComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  device$: Observable<Temp | Switch> = this.service.select<Temp | Switch>('device');

  renameLoading: boolean;

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

  onRenameClick(idx: string, name: string) {
    this.renameLoading = true;
    this.service.renameDevice(idx, name).pipe(
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
