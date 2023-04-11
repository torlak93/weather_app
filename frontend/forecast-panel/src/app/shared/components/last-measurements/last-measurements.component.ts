import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-last-measurements',
  templateUrl: './last-measurements.component.html',
  styleUrls: ['./last-measurements.component.css']
})
export class LastMeasurementsComponent implements OnInit {

  @Input() measurements = [];

  constructor() { }

  ngOnInit(): void {
  }

}
