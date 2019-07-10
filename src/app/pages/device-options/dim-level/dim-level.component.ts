import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';

@Component({
  selector: 'nd-dim-level',
  template: `
    <nb-card>
      <nb-card-body class="card-body">
        <div class="dim-container">
          <span class="title">{{ title + (level > 100 ? '100%' : level < 0 ? '0' : level + '%') }}</span>
          <nb-progress-bar id="dim-progress" [value]="level" [status]="'info'"
            (click)="onBarClick($event)" size="tiny">
          </nb-progress-bar>
          <div class="radio-container">
            <div class="radio-content">
              <svg class="radio-btn" viewBox="0 0 100 100"
                [ngStyle]="{ 'margin-left': level > 100 ? '100%' : level < 0 ? '0' : level + '%' }"
                (mousedown)="onMouseDown($event)" (mouseup)="onMouseUp($event)"
                (mousemove)="onMouseMove($event)" (touchstart)="onMouseDown($event, true)"
                (touchend)="onMouseUp($event)" (touchmove)="onMouseMove($event, true)">
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

export class DimLevelComponent implements OnInit {

  @Input() level: number;

  title = `DIM LEVEL: ` ;

  isMouseDown: boolean;

  posMouseDown: number;

  initLevel: number;

  ngOnInit() {
    this.initLevel = this.level.valueOf();
  }

  onBarClick(event: any) {
    if (event.target.className === 'progress-container') {
      this.level = Math.round(event.offsetX / event.target.clientWidth * 100);
    } else if (event.target.className === 'progress-value') {
      this.level = Math.round(event.offsetX / event.target.parentNode.clientWidth * 100);
    }
  }

  onMouseDown(event: any, isMobile?: boolean) {
    this.isMouseDown = true;
    this.posMouseDown = !isMobile ? event.clientX : event.targetTouches[0].clientX;
  }

  onMouseUp(event: any) {
    this.isMouseDown = false;
    this.posMouseDown = 0;
    this.initLevel = this.level.valueOf();
    if (this.level > 100) {
      this.level = 100;
    } else if (this.level < 0) {
      this.level = 0;
    }
  }

  onMouseMove(event: any, isMobile?: boolean) {
    if (this.isMouseDown) {
      const posDelta = (!isMobile ? event.clientX : event.targetTouches[0].clientX) - this.posMouseDown;
      let element = event.target;
      while (element.className !== 'radio-container') {
        element = element.parentNode;
      }
      if (0 <= this.level && this.level <= 100) {
        this.level = Math.round(this.initLevel + posDelta / element.clientWidth * 100);
      } else if (this.level > 100) {
        this.level = 100;
      } else if (this.level < 0) {
        this.level = 0;
      }
    }
  }

}
