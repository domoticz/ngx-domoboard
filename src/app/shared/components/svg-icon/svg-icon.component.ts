import { Component, Input } from '@angular/core';

@Component({
  selector: 'nd-svg-icon',
  template: `
  <svg>
    // SVG elements don't have properties, therefore attribute binding is needed
    // https://stackoverflow.com/a/35082700
    <use attr.xlink:href="assets/icons/{{icon}}"></use>
  </svg>
  `
})

export class SvgIconComponent {

  @Input() icon: string;

}
