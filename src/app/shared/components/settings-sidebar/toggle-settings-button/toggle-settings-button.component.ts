import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nd-toggle-settings-button',
  template: `
    <button class="toggle-settings">
      <i class="nb-gear"></i>
    </button>
  `,
  styleUrls: ['./toggle-settings-button.component.scss']
})
export class ToggleSettingsButtonComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}
