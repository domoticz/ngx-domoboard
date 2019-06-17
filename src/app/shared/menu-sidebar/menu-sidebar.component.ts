import { Component } from '@angular/core';

import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'nd-menu-sidebar',
  template: `
    <div class="sidebar-container">
      <nb-menu class="menu" tag="menu" [items]="items"></nb-menu>
    </div>
  `,
  styleUrls: ['./menu-sidebar.component.scss']
})

export class MenuSidebarComponent {

  items: NbMenuItem[] = [
    {
      title: 'Switches',
      link: '/switches',
      // icon: 'nb-danger'
    }
  ];

}
