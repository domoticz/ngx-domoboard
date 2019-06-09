import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';

import { filter, switchMap, catchError, tap, distinctUntilChanged } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { DomoticzSettings, DomoticzAuth } from '@nd/core/models';
import { SettingsService, DBService } from '@nd/core/services';

const oneFilledOutValidator: ValidatorFn = (group: FormGroup): ValidationErrors | null => {
  return Object.keys(group.value).every(key => !!group.value[key]) ||
    Object.keys(group.value).every(key => !group.value[key]) ? null : { oneFilledOut: true };
};

@Component({
  selector: 'nd-settings-sidebar',
  template: `
    <div class="sidebar-container">
      <nd-toggle-settings-button class="settings-button" (slideIn)="show()"
        [animationState]="animationState" (slideOut)="hide()">
      </nd-toggle-settings-button>
      <div class="settings-container {{ animationState }}">
        <nd-settings-content *ngIf="showContent" class="sidebar-content"
          [parent]="settingsForm" [auth]="auth$ | async" [settings]="settings$ | async">
        </nd-settings-content>
      </div>
    </div>
  `,
  styleUrls: ['./settings-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSidebarComponent implements OnInit {

  animationState = 'out';

  showContent: boolean;

  settings$ = this.dbService.store;

  ipPattern = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

  portPattern = '([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])';

  settingsForm = this.fb.group({
    ssl: [null],
    ip: [null, [Validators.pattern(this.ipPattern), Validators.required]],
    port: [null, [Validators.pattern(this.portPattern), Validators.required]],
    credentials: this.fb.group({
      username: [null],
      password: [null]
    }, { validators: oneFilledOutValidator })
  });

  auth$: Observable<DomoticzAuth> = this.settingsForm.valueChanges.pipe(
    distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y)),
    tap(value => {
      if (this.settingsForm.invalid) {
        this.dbService.setUrl(value);
      }
    }),
    filter(() => this.settingsForm.valid),
    switchMap(value =>
      this.service.getAuth(value as DomoticzSettings).pipe(
        tap(() => {
          if (auth => auth.status === 'OK' && auth.rights > -1) {
            this.dbService.addUrl(value as DomoticzSettings).then(s => {
              this.dbService.setUrl();
              console.log(s);
            }).catch(e => {
              this.dbService.setUrl();
              console.log(e);
            });
          } else {
            this.dbService.setUrl(value);
          }
        }),
        catchError(() => {
          this.dbService.setUrl(value);
          return of({} as DomoticzAuth);
        })
      ))
  );

  constructor(
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private service: SettingsService,
    private dbService: DBService
  ) { }

  ngOnInit() {
    this.dbService.openDb().then(() => this.dbService.setUrl());
  }

  getControl(name: string) {
    return this.settingsForm.get(name) as FormControl;
  }

  show() {
    this.animationState = 'in';
    this.showContent = true;
  }

  hide() {
    this.animationState = 'out';
    // Wait animation duration to destroy content.
    setTimeout(() => {
      this.showContent = false;
      this.cd.detectChanges();
    }, 400);
  }

}
