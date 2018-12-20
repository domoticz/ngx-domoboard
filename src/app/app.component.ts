import { Component, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'nd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'ngx-domoboard';

  constructor(private themeService: NbThemeService) {}

  ngOnInit() {
    this.enableDarkTheme();
  }

  enableDarkTheme() {
    this.themeService.changeTheme('cosmic');
  }

}
