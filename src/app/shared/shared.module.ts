import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NbTabsetModule, NbCardModule } from '@nebular/theme';

import { HeaderComponent, StatusCardComponent, SvgIconComponent } from './components';

import { SafePipe } from './pipes';

@NgModule({
  imports: [
    CommonModule,
    NbTabsetModule,
    NbCardModule
  ],
  exports: [
    HeaderComponent,
    StatusCardComponent,
    CommonModule,
    SafePipe,
    SvgIconComponent
  ],
  declarations: [
    HeaderComponent,
    StatusCardComponent,
    SafePipe,
    SvgIconComponent
  ]
})
export class SharedModule { }
