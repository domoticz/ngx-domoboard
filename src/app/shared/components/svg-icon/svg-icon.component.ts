import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'nd-svg-icon',
  template: `
  <svg>
    <use attr.xlink:href="assets/icons/nd-icons.svg#{{ name }}"></use>
  </svg>
  `,
  styleUrls: ['./svg-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SvgIconComponent {

  @Input() name: string;

  @Input()
  set status(value: string) {
    if (['Closed', 'Open'].includes(value)) {
      this.name += '-' + value.toLowerCase();
    }
  }

}
