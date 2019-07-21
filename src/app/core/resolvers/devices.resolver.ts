import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable, timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DevicesResolver implements Resolve<Observable<any>> {

  resolve(): Observable<any> {
    return timer(300).pipe(
      take(1)
    );
  }

}
