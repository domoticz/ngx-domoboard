import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'nd-device-options',
  template: `
    <div class="options-container">
    </div>
  `,
  styleUrls: ['./device-options.component.scss']
})
export class DeviceOptionsComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      tap((params: ParamMap) => console.log('id: ' + params.get('idx')))
    ).subscribe();
  }

}
