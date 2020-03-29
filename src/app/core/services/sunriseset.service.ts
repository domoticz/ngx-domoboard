import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of, Observable } from 'rxjs';
import { switchMap, distinctUntilChanged, tap } from 'rxjs/operators';

import { SunRiseSet } from '@nd/core/models';

import { Api } from '@nd/core/enums/api.enum';

import { DomoticzSettings } from '@nd/core/models';

import { DBService } from './db.service';


@Injectable({ providedIn: 'root' })

export class SunRiseSetService {
    settings$ = this.dbService.select<DomoticzSettings>('settings');

    constructor(protected httpClient: HttpClient, protected dbService: DBService) { }

    getSunRiseSet() {
        let cmds: string;
        cmds = Api.getSunRiseSet;
        console.log("👣 get sun rise set request-->" + cmds);

        return this.settings$.pipe(
            switchMap(settings => {
                if (!!settings) {
                    return this.httpClient.get(`${settings.ssl ? 'https' : 'http'}://${settings.domain}:${settings.port}/${Api.getSunRiseSet}`);
                } else {
                    return of(null);
                }
            })
        );
    }

}
