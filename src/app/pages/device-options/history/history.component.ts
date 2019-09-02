import { Component, ChangeDetectionStrategy, ViewChild, ElementRef,
  AfterViewInit } from '@angular/core';

import echarts from 'echarts';

@Component({
  selector: 'nd-history',
  template: `
    <nb-card>
      <nb-card-body>
        <div class="chart-container" #myChart></div>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ['./history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent implements AfterViewInit {

  @ViewChild('myChart', { static: false }) myChart: ElementRef;

  ngAfterViewInit() {
    const myChart = echarts.init(this.myChart.nativeElement);

    // specify chart configuration item and data
    const option = {
      title: {
        text: 'ECharts entry example'
      },
      tooltip: {},
      legend: {
        data: ['Sales']
      },
      xAxis: {
        data: ['shirt', 'cardign', 'chiffon shirt', 'pants', 'heels', 'socks']
      },
      yAxis: {},
      series: [{
        name: 'Sales',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    };

    // use configuration item and data specified to show chart
    myChart.setOption(option);
  }

}
