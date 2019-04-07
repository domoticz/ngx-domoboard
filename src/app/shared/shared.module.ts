import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NbTabsetModule, NbCardModule } from '@nebular/theme';

import { sharedComponents } from './components';

import { SafePipe } from './pipes';

@NgModule({
  imports: [
    CommonModule,
    NbTabsetModule,
    NbCardModule
  ],
  exports: [
    sharedComponents,
    CommonModule,
    SafePipe
  ],
  declarations: [
    sharedComponents,
    SafePipe
  ]
})
export class SharedModule { }
