import { Component, ChangeDetectionStrategy, ViewChild, ElementRef,
  AfterViewInit, OnDestroy, Input, HostListener} from '@angular/core';

import { ReplaySubject, zip } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';

import echarts from 'echarts';

import { NbThemeService } from '@nebular/theme';

import { TempGraphData } from '@nd/core/models';

@Component({
  selector: 'nd-temp-graph',
  template: `
    <div [nbSpinner]="loading">
      <div class="chart-container" #myChart></div>
    </div>
  `,
  styleUrls: ['./temp-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TempGraphComponent implements AfterViewInit, OnDestroy {

  @ViewChild('myChart', { static: false }) myChartRef: ElementRef;

  private alive = true;

  private tempData$ = new ReplaySubject<TempGraphData[]>(1);

  @Input() loading: boolean;

  @Input()
  set tempData(value) {
    if (!!value && !!value.length) {
      this.tempData$.next(value);
    }
  }

  @Input() range: string;

  myChart: any;

  option: any;

  constructor(private theme: NbThemeService) { }

  ngAfterViewInit() {
    this.myChart = echarts.init(this.myChartRef.nativeElement);
    zip(
      this.tempData$,
      this.theme.getJsTheme()
    ).pipe(
      tap(([data, config]) => {
        const tTheme: any = config.variables.temperature;
        this.option = this.getChartOption(data, this.range, tTheme);
        this.myChart.setOption(this.option);
      }),
      takeWhile(() => this.alive)
    ).subscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.myChart.resize();
    if (event.target.innerWidth < 768 && !!this.option.grid.left) {
      this.setGridLeft(null);
    } else if (event.target.innerWidth >= 768 && !this.option.grid.left) {
      this.setGridLeft('80');
    }
  }

  setGridLeft(left: string) {
    this.option = {
      ...this.option, grid: {
        ...this.option.grid, left: left
      }
    };
    this.myChart.setOption(this.option);
  }

  getChartOption(tempData: TempGraphData[], range: string, tTheme: any) {
    return {
      grid: {
        left: innerWidth < 768 ? null : '80',
        top: '5%',
        right: '5%',
        bottom: 80,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: tTheme.tooltipLineColor,
            width: tTheme.tooltipLineWidth,
          },
        },
        textStyle: {
          color: tTheme.tooltipTextColor,
          fontSize: 20,
          fontWeight: tTheme.tooltipFontWeight,
        },
        position: function (pos, params, dom, rect, size) {
          // tooltip will be fixed on the right if mouse hovering on the left,
          // and on the left if hovering on the right.
          const obj = {top: 60};
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
          return innerWidth < 768 ? obj : null;
        },
        backgroundColor: tTheme.tooltipBg,
        borderColor: tTheme.tooltipBorderColor,
        borderWidth: 1,
        formatter: '{c0} °C <br/> {b0}',
        extraCssText: tTheme.tooltipExtraCss,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        offset: 10,
        data: tempData.map(i => i.d),
        axisTick: {
          show: false
        },
        axisLabel: {
          color: tTheme.xAxisTextColor,
          fontSize: 18,
          formatter: function (value: string, idx: number) {
              const date = new Date(value);
              if (range === 'day') {
              return idx === 0 ? null :
                `0${date.getHours()}`.slice(-2) + `:` + `0${date.getMinutes()}`.slice(-2);
              } else {
                return idx === 0 ? null : [date.getMonth() + 1, date.getDate()].join('-');
              }
          }
        },
        axisLine: {
          show: false
        }
      },
      yAxis: {
        boundaryGap: [0, '5%'],
        axisLine: {
          lineStyle: {
            color: tTheme.axisLineColor,
            width: '2',
          }
        },
        axisLabel: {
          color: tTheme.xAxisTextColor,
          fontSize: 18,
          formatter: function (val: string) {
            return `${val} °C`;
          }
        },
        axisTick: {
          show: true,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: tTheme.yAxisSplitLine,
            width: '1',
          },
        },
        scale: true
      },
      series: [
        {
          type: 'line',
          smooth: true,
          symbolSize: 20,
          itemStyle: {
            normal: {
              opacity: 0,
            },
            emphasis: {
              color: '#ffffff',
              borderColor: tTheme.itemBorderColor,
              borderWidth: 2,
              opacity: 1,
            },
          },
          lineStyle: {
            normal: {
              width: tTheme.lineWidth,
              type: tTheme.lineStyle,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: tTheme.lineGradFrom,
              }, {
                offset: 1,
                color: tTheme.lineGradTo,
              }]),
              shadowColor: tTheme.lineShadow,
              shadowBlur: 6,
              shadowOffsetY: 12,
            },
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: tTheme.areaGradFrom,
              }, {
                offset: 1,
                color: tTheme.areaGradTo,
              }]),
            },
          },
          data: tempData.map(i => i.te),
        },

        {
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            normal: {
              width: tTheme.lineWidth,
              type: tTheme.lineStyle,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: tTheme.lineGradFrom,
              }, {
                offset: 1,
                color: tTheme.lineGradTo,
              }]),
              shadowColor: tTheme.shadowLineDarkBg,
              shadowBlur: 14,
              opacity: 1,
            },
          },
          data: tempData.map(i => i.te),
        },
      ],
    };
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
