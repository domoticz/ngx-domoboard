import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NbTabsetModule, NbCardModule } from '@nebular/theme';

import { HeaderComponent, StatusCardComponent } from './components';

@NgModule({
  imports: [
    CommonModule,
    NbTabsetModule,
    NbCardModule
  ],
  exports: [
    HeaderComponent,
    StatusCardComponent,
    CommonModule
  ],
  declarations: [
    HeaderComponent,
    StatusCardComponent
  ]
})
export class SharedModule { }
