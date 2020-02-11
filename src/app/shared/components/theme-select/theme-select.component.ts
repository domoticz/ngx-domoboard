import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'nd-theme-select',
  template: `
    <div class="theme--select-container">
      <nb-icon
        class="theme--select-icon"
        [icon]="'color-palette-outline'"
      ></nb-icon>
      <nb-select
        [selected]="selectedTheme"
        (selectedChange)="themeSelected.emit($event)"
      >
        <nb-option *ngFor="let theme of themes" [value]="theme.theme">{{
          theme.label
        }}</nb-option>
      </nb-select>
    </div>
  `,
  styleUrls: ['./theme-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeSelectComponent {
  @Input() selectedTheme: string;

  @Input() themes: any[];

  @Output() themeSelected = new EventEmitter<string>();
}
