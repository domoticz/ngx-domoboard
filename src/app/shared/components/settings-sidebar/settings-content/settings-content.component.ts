import { Component, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { DomoticzAuth, DomoticzSettings } from '@nd/core/models';

@Component({
  selector: 'nd-settings-content',
  template: `
    <div class="content-container" [formGroup]="parent">
      <div class="form-container">
        <div class="form-group">
          <nb-checkbox [status]="auth?.status === 'OK' ? 'success' : 'warning'" formControlName="ssl">
            SSL (mandatory for service worker support)
          </nb-checkbox>
        </div>
        <div class="form-group">
          <input nbInput formControlName="ip" type="text" class="form-control" placeholder="domoticz ip adress"
            [ngClass]="{ 'input-danger': getInvalid('ip'), 'input-success': auth?.status === 'OK' &&
            !getInvalid('ip') }">
          <div class="error-message" *ngIf="getInvalid('ip')">
            Not a valid ip adress
          </div>
        </div>
        <div class="form-group">
          <input nbInput formControlName="port" type="text" class="form-control" placeholder="port"
            [ngClass]="{ 'input-danger': getInvalid('port'), 'input-success': auth?.status === 'OK' &&
            !getInvalid('port') }">
          <div class="error-message" *ngIf="getInvalid('port')">
            Not a valid port number
          </div>
        </div>
        <div class="form-group">
          <span class="optional">Optional:</span>
        </div>
        <ng-container [formGroup]="credentials">
          <div class="form-group">
            <input nbInput formControlName="username" type="text" class="form-control" placeholder="username"
              [ngClass]="{ 'input-danger': parent.get('credentials').invalid, 'input-success': auth?.status === 'OK' &&
              !getInvalid('credentials') }">
          </div>
          <div class="form-group">
            <input nbInput formControlName="password" type="password" class="form-control" placeholder="password"
              [ngClass]="{ 'input-danger': parent.get('credentials').invalid, 'input-success': auth?.status === 'OK' &&
              !getInvalid('credentials') }">
          </div>
        </ng-container>
      </div>

      <div class="connection-state {{ auth?.status === 'OK' ? 'success' : 'danger' }}">
        <span *ngIf="auth?.status !== 'OK' else DomoticzAuth">no connection</span>
        <ng-template #DomoticzAuth>
          <span>Domoticz version: {{ auth.version }}</span>
          <span>Status: {{ auth.status }}</span>
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

  @Input() auth: DomoticzAuth;

  private _settings: DomoticzSettings;
  @Input()
  set settings(value: DomoticzSettings) {
    if (!!value) {
      // https://github.com/angular/angular/issues/27803
      if (!this.getControl('ssl')) {
        this.parent.addControl('ssl', new FormControl(value.ssl));
      } else {
        this.getControl('ssl').setValue(value.ssl, { emitEvent: false });
      }
      this.getControl('ip').setValue(value.ip, { emitEvent: false });
      this.getControl('port').setValue(value.port, { emitEvent: false });
      if (!!Object.keys(value.credentials).every(key => value.credentials[key] !== null)) {
        this.parent.get('credentials').get('username').setValue(value.credentials.username, { emitEvent: false });
        this.parent.get('credentials').get('password').setValue(value.credentials.password, { emitEvent: false });
      }
      this.parent.updateValueAndValidity();
    }
    this._settings = value;
  }
  get settings() { return this._settings; }

  credentials: FormGroup;

  getControl(name: string) {
    return this.parent.get(name) as FormControl;
  }

  getInvalid(name: string) {
    return this.getControl(name).invalid && !!this.getControl(name).value;
  }

  ngOnDestroy() {
    this.parent.removeControl('ssl');
  }

}
