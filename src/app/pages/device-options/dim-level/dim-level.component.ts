import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'nd-dim-level',
  template: `
    <nb-card>
      <nb-card-body>
        <div class="dim-container">
          <span class="title">{{ title + level + '%' }}</span>
          <nb-progress-bar id="dim-progress" [value]="level" [status]="'info'"
            (click)="onBarClick($event)" size="tiny">
          </nb-progress-bar>
          <div class="radio-container">
            <svg class="radio-btn" viewBox="0 0 100 100"
              (mousedown)="onMouseDown($event)"
              (mouseup)="onMouseUp($event)" (mousemove)="onMouseMove($event)"
              (touchstart)="onMouseDown($event, true)" (touchend)="onMouseUp($event)"
              (touchmove)="onMouseMove($event, true)">
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
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ['./dim-level.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DimLevelComponent {

  @Input() level: number = 60;

  title = `DIM LEVEL: ` ;

  isMouseDown: boolean;

  posMouseDown: number;

  onBarClick(event: any) {
    if (event.target.className === 'progress-container') {
      this.level = Math.round(event.offsetX / event.target.clientWidth * 100);
    } else if (event.target.className === 'progress-value') {
      this.level = Math.round(event.offsetX / event.target.parentNode.clientWidth * 100);
    }
  }

  onMouseDown(event: any, isMobile?: boolean) {
    console.log(event);
    this.isMouseDown = true;
    this.posMouseDown = !isMobile ? event.clientX : event.targetTouches[0].clientX;
    let element = event.target;
    while (element.className !== 'progress-container') {
      element = element.parentNode;
    }
    // this.level = event.offsetX / element.clientWidth * 100;
  }

  onMouseUp(event: any) {
    this.isMouseDown = false;
  }

  onMouseMove(event: any, isMobile?: boolean) {
    if (this.isMouseDown) {
      const posDelta = (!isMobile ? event.clientX : event.targetTouches[0].clientX) - this.posMouseDown;
      let element = event.target;
      let radioElement;
      while (element.className !== 'progress-container') {
        if (element.className === 'radio-btn') {
          radioElement = element;
        }
        element = element.parentNode;
      }
      console.log(event);
      this.level = 18 + posDelta / element.clientWidth * 100;
    }
  }

}
