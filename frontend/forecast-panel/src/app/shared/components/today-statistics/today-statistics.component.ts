import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-today-statistics',
  templateUrl: './today-statistics.component.html',
  styleUrls: ['./today-statistics.component.css']
})
export class TodayStatisticsComponent implements OnInit {

  @Input() data: any = [];

  cardColor: string = '#1b202bb3';
  colorScheme = {
    domain: ['#5BDCE2', '#F7ACCF', '#6874E8', "#6564DB"]
  };

  constructor() { }

  ngOnInit(): void {
  }

  onSelect(event) {
    console.log(event);
  }

}
