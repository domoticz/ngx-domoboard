import { Component, Output, EventEmitter, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'nd-toggle-settings-button',
  template: `
    <button class="toggle-settings" (click)="animationState === 'in' ? slideOut.emit() : slideIn.emit()">
      <nd-svg-icon class="nd-gear" [ngClass]="{ 'pulse': animationState === 'out' }"
        [name]="'nd-gear'">
      </nd-svg-icon>
    </button>
  `,
  styleUrls: ['./toggle-settings-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleSettingsButtonComponent {

  @Input() animationState: string;

  @Output() slideIn = new EventEmitter();

  @Output() slideOut = new EventEmitter();

}
