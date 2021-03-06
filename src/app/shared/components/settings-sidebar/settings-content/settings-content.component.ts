import { Component, ChangeDetectionStrategy, Input, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective } from '@angular/forms';

import { DomoticzAuth, DomoticzSettings } from '@nd/core/models';

@Component({
  selector: 'nd-settings-content',
  template: `
    <div class="content-container" [nbSpinner]="loading">
      <div class="form-container" [formGroup]="parent">
        <button type="reset" nbButton outline status="primary" class="clear-btn"
          (click)="onClearClick()">
          clear settings
        </button>
        <div class="form-group">
          <nb-checkbox formControlName="ssl" status="{{ connected ? 'success' : 'warning' }}">
            SSL (mandatory for service worker support)
          </nb-checkbox>
        </div>
        <div class="form-group">
          <input nbInput formControlName="domain" type="text" class="form-control" placeholder="domain / ip"
            [ngClass]="{ 'input-danger': getInvalid('domain'), 'input-success': connected &&
            !getInvalid('domain') }">
          <div class="error-message" *ngIf="getInvalid('domain')">
            Domain is required
          </div>
        </div>
        <div class="form-group">
          <input nbInput formControlName="port" type="text" class="form-control" placeholder="port"
            [ngClass]="{ 'input-danger': getInvalid('port'), 'input-success': connected &&
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
              [ngClass]="{ 'input-danger': parent.get('credentials').invalid, 'input-success': connected &&
              !getInvalid('credentials') }">
          </div>
          <div class="form-group">
            <input nbInput formControlName="password" type="password" class="form-control" placeholder="password"
              [ngClass]="{ 'input-danger': parent.get('credentials').invalid, 'input-success': connected &&
              !getInvalid('credentials') }">
          </div>
        </ng-container>
      </div>

      <div class="connection-state {{ connected ? 'success' : 'danger' }}">
        <span *ngIf="auth?.status !== 'OK'">no connection</span>
        <span *ngIf="auth?.rights === -1">need authentication</span>
        <ng-container *ngIf="connected">
          <span>Domoticz version: {{ auth.version }}</span>
          <span>Status: {{ auth.status }}</span>
        </ng-container>
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

  private _auth: DomoticzAuth;
  @Input()
  set auth(value) {
    if (!!value) {
      this.connected = value.status === 'OK' && value.rights > -1;
      this._auth = value;
    }
  }
  get auth() { return this._auth; }

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
      this.getControl('domain').setValue(value.domain, { emitEvent: false });
      this.getControl('port').setValue(value.port, { emitEvent: false });
      if (!!Object.keys(value.credentials).every(key => value.credentials[key] !== null)) {
        this.parent.get('credentials').get('username').setValue(value.credentials.username, { emitEvent: false });
        this.parent.get('credentials').get('password').setValue(value.credentials.password, { emitEvent: false });
      }
      this.parent.updateValueAndValidity();
    } else if (!this.getControl('ssl')) {
      this.parent.addControl('ssl', new FormControl(null));
    }
    this._settings = value;
  }
  get settings() { return this._settings; }

  @Input() loading: boolean;

  @Output() clearClick = new EventEmitter();

  credentials: FormGroup;

  connected: boolean;

  getControl(name: string) {
    return this.parent.get(name) as FormControl;
  }

  getInvalid(name: string) {
    return this.getControl(name).invalid && !!this.getControl(name).value;
  }

  onClearClick() {
    this.clearClick.emit();
  }

  ngOnDestroy() {
    this.parent.removeControl('ssl');
  }

}
