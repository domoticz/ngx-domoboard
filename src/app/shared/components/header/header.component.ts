import {
  Component,
  Input,
  Output,
  ChangeDetectionStrategy,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '@nd/../environments/environment';

@Component({
  selector: 'nd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HeaderComponent {
  @Input() position = 'normal';

  @Input() themes: any[];

  @Input() selectedTheme: string;

  @Output() menuToggle = new EventEmitter();

  @Output() themeSelected = new EventEmitter<string>();

  name = environment.name;

  routes = {
    Dashboard: 'devices/dashboard',
    Switches: 'devices/switches',
    Temperature: 'devices/temperature',
    Scenes: 'devices/scenes',
    Utility: 'devices/utility'
  };

  constructor(private router: Router, private cd: ChangeDetectorRef) { }

  onChangeTab(event: any) {
    this.router.navigate([this.routes[event.tabTitle]]);
  }
}
