import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'nd-dim-level',
  template: `
    <nb-card>
      <nb-card-body>
        <div class="dim-container">
          <span class="title">{{ title + level + '%' }}</span>
          <nb-progress-bar id="dim-progress" [value]="level" [status]="'info'"
            (click)="onBarClick($event)">
            <div class="radio-btn" [ngStyle]="{ 'left': level + '%' }">
              <svg viewBox="0 0 100 100">
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
          </nb-progress-bar>
        </div>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ['./dim-level.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DimLevelComponent {

  @Input() level: number;

  title = `DIM LEVEL: ` ;

  onBarClick(event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log(event);
    console.log(event.offsetX / event.target.clientWidth * 100);
  }

}
