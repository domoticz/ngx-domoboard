import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { filter, switchMap, catchError, tap, finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { SettingsService, DBService } from '@nd/core/services';
import { DomoticzStatus } from '@nd/core/models/domoticz-status.interface';
import { BaseUrl } from '@nd/core/models';

@Component({
  selector: 'nd-settings-sidebar',
  template: `
    <div class="sidebar-container">
      <nd-toggle-settings-button class="settings-button" (slideIn)="show()"
        [animationState]="animationState" (slideOut)="hide()">
      </nd-toggle-settings-button>
      <div class="settings-container {{ animationState }}">
        <nd-settings-content *ngIf="showContent" class="sidebar-content"
          [parent]="settingsForm" [status]="status$ | async" [baseUrl]="baseUrl$ | async">
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

  baseUrl$ = this.dbService.store;

  ipPattern = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

  portPattern = '([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])';

  settingsForm = this.fb.group({
    ssl: [null],
    ip: [null, [Validators.pattern(this.ipPattern), Validators.required]],
    port: [null, [Validators.pattern(this.portPattern), Validators.required]]
  });

  status$: Observable<DomoticzStatus> = this.settingsForm.valueChanges.pipe(
    filter(() => this.settingsForm.valid),
    switchMap(value =>
      this.service.getStatus(value as BaseUrl).pipe(
        tap(status => {
          if (status.status === 'OK') {
            this.dbService.addUrl(value as BaseUrl);
          }
        }),
        catchError(() => of({} as DomoticzStatus)),
        finalize(() => this.dbService.setUrl())
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
