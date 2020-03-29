import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';

import { fromEvent, Subject } from 'rxjs';
import { tap, filter, takeUntil } from 'rxjs/operators';

import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'nd-menu-sidebar',
  template: `
    <div id="menu-sidebar" class="{{ animationState }}">
      <div class="menu-container {{ animationState }}">
        <nb-menu id="menu" tag="menu" [items]="items"></nb-menu>
        <nd-theme-select
          class="menu--theme-container"
          [selectedTheme]="selectedTheme"
          [themes]="themes"
          (themeSelected)="themeSelected.emit($event)">
          </nd-theme-select>
      </div>
    </div>
  `,
  styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();

  @Input() animationState: string;

  @Input() selectedTheme: string;

  @Input() themes: any[];

  @Output() outsideClick = new EventEmitter();

  @Output() themeSelected = new EventEmitter<string>();

  items: NbMenuItem[] = [
    {
      title: 'Dashboard',
      link: '/devices/dashboard',
      icon: 'color-palette-outline'
    },
    {
      title: 'Switches',
      link: '/devices/switches',
      icon: 'toggle-left-outline'
    },
    {
      title: 'Temperature',
      link: '/devices/temperature',
      icon: 'thermometer-outline'
    },
    {
      title: 'Scenes',
      link: '/devices/scenes',
      icon: 'toggle-left-outline'
    },
    {
      title: 'Utility',
      link: '/devices/utility',
      icon: 'activity-outline'
    }
  ];

  ngOnInit() {
    fromEvent(document, 'click')
      .pipe(
        tap(event => {
          event.preventDefault();
          event.stopPropagation();
        }),
        filter(
          (event: any) =>
            this.animationState === 'in' &&
            event.target.id !== 'menu' &&
            event.target.id !== 'menu-icon' &&
            event.target.type !== 'button'
        ),
        tap(() => this.outsideClick.emit()),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
