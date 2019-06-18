import { Component, Input } from '@angular/core';

import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'nd-menu-sidebar',
  template: `
    <div class="sidebar-container {{ animationState }}">
      <nb-menu class="menu" tag="menu" [items]="items"></nb-menu>
    </div>
  `,
  styleUrls: ['./menu-sidebar.component.scss']
})

export class MenuSidebarComponent {

  @Input() animationState: string;

  items: NbMenuItem[] = [
    {
      title: 'Switches',
      link: '/switches',
      icon: 'toggle-left-outline'
    },
    {
      title: 'Temperature',
      link: '/temperature',
      icon: 'thermometer-outline'
    }
  ];

}
