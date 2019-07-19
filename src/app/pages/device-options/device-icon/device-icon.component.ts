import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'nd-icon',
  template: `
  <nb-card>
    <nb-card-body>
      <div class="icon-container">
        <div class="icon-form">
          <input class="icon-input" nbInput type="text">
          <button class="icon-btn" nbButton status="primary">
            <nb-icon icon="checkmark-outline"></nb-icon>
          </button>
        </div>
      </div>
    </nb-card-body>
  </nb-card>
  `,
  styleUrls: ['./device-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DeviceIconComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}
