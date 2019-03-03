import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

enum routes {
  Switches = 'switches',
  Misc = ''
}

@Component({
  selector: 'nd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {

  @Input() position = 'normal';

  name = environment.name;

  constructor(private router: Router) { }

  onChangeTab(event) {
    this.router.navigate([routes[event.tabTitle]]);
  }

}
