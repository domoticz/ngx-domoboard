import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'domoboard', loadChildren: './pages/domoboard/domoboard.module#DomoboardModule' },
  { path: '',   redirectTo: '/domoboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/domoboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
