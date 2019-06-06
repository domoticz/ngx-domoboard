import { Component, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { DomoticzStatus } from '@nd/core/models/domoticz-status.interface';
import { DomoticzSettings } from '@nd/core/models';

@Component({
  selector: 'nd-settings-content',
  template: `
    <div class="content-container" [formGroup]="parent">
      <div class="form-container">
        <div class="form-group">
          <nb-checkbox [status]="status?.status === 'OK' ? 'success' : 'warning'" formControlName="ssl">
            SSL (mandatory for service worker support)
          </nb-checkbox>
        </div>
        <div class="form-group">
          <input nbInput formControlName="ip" type="text" class="form-control" placeholder="domoticz ip adress"
            [ngClass]="{ 'input-danger': getInvalid(parent, 'ip'), 'input-success': status?.status === 'OK' &&
            !getInvalid(parent, 'ip') }">
          <div class="error-message" *ngIf="getInvalid(parent, 'ip')">
            Not a valid ip adress
          </div>
        </div>
        <div class="form-group">
          <input nbInput formControlName="port" type="text" class="form-control" placeholder="port"
            [ngClass]="{ 'input-danger': getInvalid(parent, 'port'), 'input-success': status?.status === 'OK' &&
            !getInvalid(parent, 'port') }">
          <div class="error-message" *ngIf="getInvalid(parent, 'port')">
            Not a valid port number
          </div>
        </div>
        <div class="form-group">
          <span class="optional">Optional:</span>
        </div>
        <ng-container [formGroup]="credentials">
          <div class="form-group">
            <input nbInput formControlName="username" type="text" class="form-control" placeholder="username"
              [ngClass]="{ 'input-danger': getInvalid(credentials, 'username'), 'input-success': status?.status === 'OK' &&
              !getInvalid(credentials, 'username') }">
          </div>
          <div class="form-group">
            <input nbInput formControlName="password" type="text" class="form-control" placeholder="password"
              [ngClass]="{ 'input-danger': getInvalid(credentials, 'password'), 'input-success': status?.status === 'OK' &&
              !getInvalid(credentials, 'password') }">
          </div>
        </ng-container>
      </div>

      <div class="connection-state {{ status?.status === 'OK' ? 'success' : 'danger' }}">
        <span *ngIf="status?.status !== 'OK' else domoticzStatus">no connection</span>
        <ng-template #domoticzStatus>
          <span>Domoticz version: {{ status.version }}</span>
          <span>Status: {{ status.status }}</span>
        </ng-template>
      </div>
    </div>
  `,
  styleUrls: ['./settings-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsContentComponent implements OnDestroy {

  private _parent: FormGroup;
  @Input()
  set parent(value) {
    this.credentials = value.get('credentials') as FormGroup;
    this._parent = value;
  }
  get parent() { return this._parent; }

  @Input() status: DomoticzStatus;

  private _settings: DomoticzSettings;
  @Input()
  set settings(value: DomoticzSettings) {
    if (!!value) {
      // https://github.com/angular/angular/issues/27803
      if (!this.getControl(this.parent, 'ssl')) {
        this.parent.addControl('ssl', new FormControl(value.ssl));
      } else {
        this.getControl(this.parent, 'ssl').setValue(value.ssl, { emitEvent: false });
      }
      this.getControl(this.parent, 'ip').setValue(value.ip, { emitEvent: false });
      this.getControl(this.parent, 'port').setValue(value.port, { emitEvent: false });
      this.parent.updateValueAndValidity();
    }
    this._settings = value;
  }
  get settings() { return this._settings; }

  credentials: FormGroup;

  getControl(parent: FormGroup, name: string) {
    return parent.get(name) as FormControl;
  }

  getInvalid(parent: FormGroup, name: string) {
    return this.getControl(parent, name).invalid && !!this.getControl(parent, name).value;
  }

  ngOnDestroy() {
    this.parent.removeControl('ssl');
  }

}
