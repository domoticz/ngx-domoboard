import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'nd-settings-content',
  template: `
    <div class="content-container" [formGroup]="parent">
      <div class="form-container">
        <div class="form-group">
          <nb-checkbox formControlName="ssl">SSL (mandatory for service worker)</nb-checkbox>
        </div>
        <div class="form-group">
          <input nbInput formControlName="ip" type="text" class="form-control" placeholder="domoticz ip adress"
            [ngClass]="{ 'input-danger': getInvalid('ip') }">
          <div class="error-message" *ngIf="getInvalid('ip')">
            Not a valid ip adress
          </div>
        </div>
        <div class="form-group">
          <input nbInput formControlName="port" type="text" class="form-control" placeholder="port"
            [ngClass]="{ 'input-danger': getInvalid('port') }">
          <div class="error-message" *ngIf="getInvalid('port')">
            Not a valid port number
          </div>
        </div>
      </div>

      <div class="connection-state">
        <span>no connection</span>
      </div>
    </div>
  `,
  styleUrls: ['./settings-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsContentComponent {

  @Input() parent: FormGroup;

  getControl(name: string) {
    return this.parent.get(name) as FormControl;
  }

  getInvalid(name: string) {
    return this.getControl(name).invalid && !!this.getControl(name).value;
  }

}
