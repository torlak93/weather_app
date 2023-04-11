import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Years';
  showYAxisLabel: boolean = true;
  prices: any[] = [];
  view: any[] = [700, 400];
  @Input() data: any[];
  @Input() yAxisLabel;

  colorScheme = {
    domain: ['#5BDCE2', '#F7ACCF', '#6874E8', "#6564DB"]
  };
  schemeType: string = 'ordinal';

  constructor() { }

  ngOnInit(): void {
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  onResize(num) {
    console.log(num)
    this.view = [num, 300];
  }

}
