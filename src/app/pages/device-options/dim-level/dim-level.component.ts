import { Component, ChangeDetectionStrategy, Input, OnInit, Output,
  EventEmitter, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import { fromEvent, Subject } from 'rxjs';
import { tap, filter, takeUntil, debounceTime } from 'rxjs/operators';
import { Switch } from '@nd/core/models';

@Component({
  selector: 'nd-dim-level',
  template: `
    <nb-card>
      <nb-card-body class="card-body">
        <div class="dim-container">
          <span class="title">{{ title + (device.Level > 100 ? '100%' : device.Level < 0 ? '0' : device.Level + '%') }}</span>
          <nb-progress-bar id="dim-progress" [value]="device.Level" [status]="'info'"
            (click)="onBarClick($event)" size="tiny">
          </nb-progress-bar>
          <div class="radio-container" #radioContainer>
            <div class="radio-content">
              <svg class="radio-btn" viewBox="0 0 100 100"
                [ngStyle]="{ 'margin-left': device.Level > 100 ? '100%' : device.Level < 0 ? '0' : device.Level + '%' }"
                (mousedown)="onMouseDown($event)" (touchmove)="onMouseMove($event, true)"
                (touchstart)="onMouseDown($event, true)" (touchend)="onMouseUp()">
                <defs>
                  <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style="stop-color:rgb(255,255,255);
                      stop-opacity:1" />
                    <stop offset="100%" style="stop-color:rgb(152,152,152);stop-opacity:1" />
                  </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="50" fill="url(#grad1)"/>
              </svg>
            </div>
          </div>
        </div>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ['./dim-level.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DimLevelComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  private debouncer$ = new Subject<Switch>();

  @ViewChild('radioContainer', { static: true }) radioContainerRef: ElementRef;

  @Input() device: Switch;

  @Output() levelSet = new EventEmitter<Switch>();

  title = `DIM LEVEL: ` ;

  isMouseDown: boolean;

  posMouseDown: number;

  initLevel: number;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.initLevel = this.device.Level.valueOf();
    fromEvent(document, 'mousemove').pipe(
      filter(() => this.isMouseDown),
      tap((event: any) => this.onMouseMove(event)),
      takeUntil(this.unsubscribe$)
    ).subscribe();
    fromEvent(document, 'mouseup').pipe(
      filter(() => this.isMouseDown),
      tap(() => this.onMouseUp()),
      takeUntil(this.unsubscribe$)
    ).subscribe();
    fromEvent(document, 'mouseleave').pipe(
      filter(() => this.isMouseDown),
      tap(() => this.isMouseDown = false),
      takeUntil(this.unsubscribe$)
    ).subscribe();
    this.debouncer$.pipe(
      debounceTime(1000),
      tap(value => this.levelSet.emit(value)),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  onBarClick(event: any) {
    this.device.Level = Math.round(event.offsetX / this.radioContainerRef.nativeElement.clientWidth * 100);
    this.initLevel = this.device.Level.valueOf();
    this.levelSet.emit(this.device);
  }

  onMouseDown(event: any, isMobile?: boolean) {
    this.isMouseDown = true;
    this.posMouseDown = !isMobile ? event.clientX : event.targetTouches[0].clientX;
  }

  onMouseUp() {
    this.isMouseDown = false;
    this.posMouseDown = 0;
    this.initLevel = this.device.Level.valueOf();
    if (this.device.Level > 100) {
      this.device.Level = 100;
    } else if (this.device.Level < 0) {
      this.device.Level = 0;
    }
  }

  onMouseMove(event: any, isMobile?: boolean) {
    event.preventDefault();
    if (this.isMouseDown) {
      const posDelta = (!isMobile ? event.clientX : event.targetTouches[0].clientX) - this.posMouseDown;
      if (0 <= this.device.Level && this.device.Level <= 100) {
        this.device.Level =
          Math.round(this.initLevel + posDelta / this.radioContainerRef.nativeElement.clientWidth * 100);
      } else if (this.device.Level > 100) {
        this.device.Level = 100;
      } else if (this.device.Level < 0) {
        this.device.Level = 0;
      }
      this.debouncer$.next(this.device);
      this.cd.detectChanges();
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
