import { Component, ChangeDetectionStrategy, ViewChild, ElementRef,
  AfterViewInit, OnDestroy, Input, OnInit} from '@angular/core';

import { takeWhile, delay, tap } from 'rxjs/operators';

import echarts from 'echarts';

import { NbThemeService } from '@nebular/theme';
import { TempGraphData } from '@nd/core/models';
import { Subject, zip } from 'rxjs';

@Component({
  selector: 'nd-temp-graph',
  template: `
    <div [nbSpinner]="loading" class="chart-container" #myChart></div>
  `,
  styleUrls: ['./temp-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TempGraphComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('myChart', { static: false }) myChart: ElementRef;

  private alive = true;

  private tempData$ = new Subject<TempGraphData[]>();

  @Input() loading: boolean;

  @Input() tempData: TempGraphData[];

  myChart: any;

  constructor(private theme: NbThemeService) { }

  ngOnInit() {
    zip(
      this.tempData$,
      this.theme.getJsTheme()
    ).pipe(
      tap(([data, config]) => {
        if (!!data && !!data.length) {
          const tTheme: any = config.variables.temperature;
          const option = this.getChartOption(data, tTheme);
          this.myChart.setOption(option);
        }
      })
    );
  }

  ngAfterViewInit() {
    this.myChart = echarts.init(this.myChart.nativeElement);
  }

  getChartOption(tempData: TempGraphData[], tTheme: any) {
    return {
      grid: {
        left: '15%',
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
        position: 'top',
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
              return idx % 2 ? null : `0${date.getHours()}`.slice(-2) + `:` + `0${date.getMinutes()}`.slice(-2);
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
        scale: true,
        interval: .5
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
