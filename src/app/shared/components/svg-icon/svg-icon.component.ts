import { Component, Input } from '@angular/core';

@Component({
  selector: 'nd-svg-icon',
  template: `
  <svg>
    <use attr.xlink:href="assets/icons/nd-icons.svg#{{ name }}"></use>
  </svg>
  `,
  styleUrls: ['./svg-icon.component.scss']
})

export class SvgIconComponent {

  @Input() name: string;

}
