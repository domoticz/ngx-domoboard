import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { NbMenuItem } from '@nebular/theme';
import { fromEvent, Subject } from 'rxjs';
import { tap, filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'nd-menu-sidebar',
  template: `
    <div id="menu-sidebar" class="{{ animationState }}">
      <nb-menu class="menu" tag="menu" [items]="items"></nb-menu>
    </div>
  `,
  styleUrls: ['./menu-sidebar.component.scss']
})

export class MenuSidebarComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  @Input() animationState: string;

  @Output() outsideClick = new EventEmitter();

  items: NbMenuItem[] = [
    {
      title: 'Switches',
      link: '/switches',
      icon: 'toggle-left-outline'
    },
    {
      title: 'Temperature',
      link: '/temperature',
      icon: 'thermometer-outline'
    }
  ];

  ngOnInit() {
    fromEvent(document, 'click').pipe(
      tap(event => {
        event.preventDefault();
        event.stopPropagation();
      }),
      filter(event => this.animationState === 'in' && !event['path'].find(p =>
        p.id === 'menu-sidebar' || p.id === 'menu-icon')),
      tap(() => this.outsideClick.emit()),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
