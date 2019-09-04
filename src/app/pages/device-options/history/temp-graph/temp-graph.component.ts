import { Component, ChangeDetectionStrategy, ViewChild, ElementRef,
  AfterViewInit, OnDestroy, Input, ChangeDetectorRef} from '@angular/core';

import { takeWhile, delay } from 'rxjs/operators';

import echarts from 'echarts';

import { NbThemeService } from '@nebular/theme';
import { TempGraphData } from '@nd/core/models';

@Component({
  selector: 'nd-temp-graph',
  template: `
    <div class="graph-container">
      <div [nbSpinner]="loading" class="chart-container" #myChart></div>
    </div>
  `,
  styleUrls: ['./temp-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TempGraphComponent implements AfterViewInit, OnDestroy {

  private alive = true;

  @Input() loading: boolean;

  @Input() tempData: TempGraphData[];

  @ViewChild('myChart', { static: false }) myChart: ElementRef;

  data: any[];

  constructor(
    private theme: NbThemeService,
    private cd: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    const myChart = echarts.init(this.myChart.nativeElement);

    this.cd.detectChanges();

    this.theme.getJsTheme().pipe(
      takeWhile(() => this.alive),
      delay(1000)
    ).subscribe(config => {
      console.log(config);
      console.log(this.tempData);
      const eTheme: any = config.variables.electricity;

      this.cd.detectChanges();

      const option = {
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 80,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: eTheme.tooltipLineColor,
              width: eTheme.tooltipLineWidth,
            },
          },
          textStyle: {
            color: eTheme.tooltipTextColor,
            fontSize: 20,
            fontWeight: eTheme.tooltipFontWeight,
          },
          position: 'top',
          backgroundColor: eTheme.tooltipBg,
          borderColor: eTheme.tooltipBorderColor,
          borderWidth: 1,
          formatter: '{c0} kWh',
          extraCssText: eTheme.tooltipExtraCss,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          offset: 25,
          data: this.tempData.map(i => i.d),
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: eTheme.xAxisTextColor,
            fontSize: 18,
          },
          axisLine: {
            lineStyle: {
              color: eTheme.axisLineColor,
              width: '2',
            },
          },
        },
        yAxis: {
          boundaryGap: [0, '5%'],
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: eTheme.yAxisSplitLine,
              width: '1',
            },
          },
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
                borderColor: eTheme.itemBorderColor,
                borderWidth: 2,
                opacity: 1,
              },
            },
            lineStyle: {
              normal: {
                width: eTheme.lineWidth,
                type: eTheme.lineStyle,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: eTheme.lineGradFrom,
                }, {
                  offset: 1,
                  color: eTheme.lineGradTo,
                }]),
                shadowColor: eTheme.lineShadow,
                shadowBlur: 6,
                shadowOffsetY: 12,
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: eTheme.areaGradFrom,
                }, {
                  offset: 1,
                  color: eTheme.areaGradTo,
                }]),
              },
            },
            data: this.tempData.map(i => i.te),
          },

          {
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: {
              normal: {
                width: eTheme.lineWidth,
                type: eTheme.lineStyle,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: eTheme.lineGradFrom,
                }, {
                  offset: 1,
                  color: eTheme.lineGradTo,
                }]),
                shadowColor: eTheme.shadowLineDarkBg,
                shadowBlur: 14,
                opacity: 1,
              },
            },
            data: this.tempData.map(i => i.te),
          },
        ],
      };

      myChart.setOption(option);
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
