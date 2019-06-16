import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NbTabsetModule, NbCardModule, NbInputModule, NbCheckboxModule, NbSpinnerModule } from '@nebular/theme';

import { sharedComponents } from './components';

import { SafePipe } from './pipes';

@NgModule({
  imports: [
    CommonModule,
    NbTabsetModule,
    NbCardModule,
    ReactiveFormsModule,
    NbInputModule,
    NbCheckboxModule,
    NbSpinnerModule
  ],
  exports: [
    sharedComponents,
    CommonModule,
    SafePipe,
    NbCardModule,
    NbSpinnerModule
  ],
  declarations: [
    sharedComponents,
    SafePipe
  ]
})
export class SharedModule { }
