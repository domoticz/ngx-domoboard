import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nd-settings-sidebar',
  template: `
    <div class="sidebar-container">
      <nd-toggle-settings-button class="settings-button"></nd-toggle-settings-button>
      <div class="sidebar-content"></div>
    </div>
  `,
  styleUrls: ['./settings-sidebar.component.scss']
})
export class SettingsSidebarComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}
