import { Component, OnInit, OnDestroy } from '@angular/core';

import { DevicesService } from '@nd/core/services';
import { Temp } from '@nd/core/models';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'nd-temperature',
  template: `
    <div class="type-container" [nbSpinner]="loading$ | async">
      <ng-container *ngFor="let type of (types$ | async)">
        <span class="type">{{ type }}</span>

        <div class="row">
          <ng-container *ngFor="let temp of (temps$ | async)">
            <div class="col-xxxl-3 col-md-6" *ngIf="temp.Type === type">
              <nd-status-card [title]="temp.Name" [disabled]="temp.HaveTimeout"
                [status]="temp.Data">
                <nb-icon class="temp-icon" icon="{{ temp.Temp ? 'thermometer-outline' : 'droplet-outline' }}">
                </nb-icon>
              </nd-status-card>
            </div>
          </ng-container>
        </div>
      </ng-container>
    </div>
  `,
  styleUrls: ['./temperature.component.scss']
})
export class TemperatureComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  loading$ = this.service.loading$;

  types$ = this.service.select<string[]>('types');

  temps$ = this.service.select<Temp[]>('devices');

  icon = {
    Fireplace: 'nd-fireplace',
    Light: 'nb-lightbulb',
    Door: 'nd-door'
  };

  constructor(private service: DevicesService<Temp>) { }

  ngOnInit() {
    merge(
      this.service.getDevices('temp'),
      this.service.refreshDevices('temp')
    ).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
