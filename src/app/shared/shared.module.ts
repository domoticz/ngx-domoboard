import { NgModule } from '@angular/core';

import { NbTabsetModule } from '@nebular/theme';

import { HeaderComponent } from './components';

@NgModule({
  imports: [NbTabsetModule],
  exports: [HeaderComponent],
  declarations: [HeaderComponent]
})
export class SharedModule { }
