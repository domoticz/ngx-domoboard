import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '@nd/../environments/environment';

@Component({
  selector: 'nd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input() position = 'normal';

  name = environment.name;

  routes = {
    Switches: 'switches',
  };

  constructor(private router: Router) { }

  onChangeTab(event) {
    this.router.navigate([this.routes[event.tabTitle]]);
  }

}
