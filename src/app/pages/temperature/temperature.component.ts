import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DevicesService } from '@nd/core/services';
import { Temp } from '@nd/core/models';

@Component({
  selector: 'nd-temperature',
  template: `
    <div class="type-container" *ngIf="!!(temps$ | async).length; else noDevices"
      [nbSpinner]="loading$ | async">
      <ng-container *ngFor="let type of (types$ | async)">
        <span class="type">{{ type }}</span>

        <div class="row">
          <ng-container *ngFor="let temp of (temps$ | async)">
            <div class="col-xxxl-3 col-md-6" *ngIf="temp.Type === type">
              <nd-status-card [title]="temp.Name" [disabled]="temp.HaveTimeout"
                [status]="temp.Data" (optionsClick)="onOptionsClick(temp.idx)">
                <nb-icon class="temp-icon" icon="{{ temp.Temp ? 'thermometer-outline' : 'droplet-outline' }}">
                </nb-icon>
              </nd-status-card>
            </div>
          </ng-container>
        </div>
      </ng-container>
    </div>

    <ng-template #noDevices>
      <div class="no-devices">
        <span>No</span>
        <span>devices</span>
        <span>found</span>
      </div>
    </ng-template>
  `,
  styleUrls: ['./temperature.component.scss']
})
export class TemperatureComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  loading$ = this.service.loading$;

  types$ = this.service.select<string[]>('types');

  temps$ = this.service.select<Temp[]>('devices');

  constructor(
    private service: DevicesService<Temp>,
    private router: Router
    ) { }

  ngOnInit() {
    merge(
      this.service.getDevices('temp'),
      this.service.refreshDevices('temp')
    ).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  onOptionsClick(idx: string) {
    this.router.navigate(['options', idx]);
  }

  ngOnDestroy() {
    this.service.clearStore();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
