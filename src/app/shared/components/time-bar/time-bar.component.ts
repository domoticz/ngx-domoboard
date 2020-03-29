import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subject, merge } from 'rxjs';

import { Router, ActivatedRoute, NavigationStart } from '@angular/router';

import {
    tap,
    takeUntil,
    take,
    finalize,
    skip,
    switchMap
} from 'rxjs/operators';

import { SunRiseSet } from '@nd/core/models';

import { SunRiseSetService } from '@nd/core/services';

@Component({
    selector: 'nd-time-bar',
    templateUrl: './time-bar.component.html',
    styleUrls: ['./time-bar.component.scss']
})


export class TimeBarComponent {
    title = 'time-bar';
    private loader = false;
    sunRiseSet: SunRiseSet;

    //emit value in sequence every 10 second
    subscribe = interval(15000)
        .subscribe(val => {
            this.getSunRiseSet();
        });

    constructor(public http: HttpClient, private sunRiseSetService: SunRiseSetService) { }
    ngOnInit(): void {
        this.getSunRiseSet();
    }
    getSunRiseSet() {
        this.loader = true;
        this.sunRiseSetService
            .getSunRiseSet()
            .subscribe((data: SunRiseSet) => {
                this.loader = false;
                this.sunRiseSet = data;
            });
    }
    ngOnDestroy() {
        this.subscribe.unsubscribe();
    }
}