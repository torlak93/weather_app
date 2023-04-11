import { Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { DataService } from 'src/app/core/data/data.service';
import { ForecastService } from 'src/app/core/services/forecast.service';
import * as moment from 'moment';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  time = '1 minutes';
  unit = 'minutes';
  measurements;
  isLoading = false;
  isGapfill: boolean = false;

  todayStatistics: any[] = [];
  view: any[];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  line1: any[];
  line2: any[];
  line3: any[];
  line4: any[];

  dateFrom = new Date().toISOString().split('T')[0];
  dateTo = new Date().toISOString().split('T')[0];
  countDays: any;
  minTemp: any;
  maxTemp: any;
  overUnder = 30;
  year = 2023;
  sensor = '';
  modelFrom;
  modelTo;

  faCalendar = faCalendar;

  constructor(
    private forecastService: ForecastService,
    private dataService: DataService,
    private calendar: NgbCalendar
  ) {
    this.modelFrom = this.calendar.getToday();
    this.modelTo = this.calendar.getToday();

    console.log(this.modelFrom);

    this.isLoading = true;

    forkJoin({
      statistics: this.forecastService.getStatistics(),
      lastMeasurements: this.forecastService.getLastForecast(),
      countDays: this.forecastService.getDaysCount(this.overUnder, this.year),
      minMax: this.forecastService.getMinMaxTemperature(this.measureType),
      measurements1: this.forecastService.getForecast(
        this.sensor,
        this.time.toString(),
        this.dateFrom,
        this.dateTo,
        this.isGapfill,
        this.measureType1
      ),
      measurements2: this.forecastService.getForecastLocf(
        this.sensor,
        this.time.toString(),
        this.dateFrom,
        this.dateTo,
        this.measureType2
      ),
      measurements3: this.forecastService.getLastMeasurements(
        this.sensor,
        this.time.toString(),
        this.dateFrom,
        this.dateTo,
        this.isGapfill,
        this.measureType3,
        'first'
      ),
      measurements4: this.forecastService.getLastMeasurements(
        this.sensor,
        this.time.toString(),
        this.dateFrom,
        this.dateTo,
        this.isGapfill,
        this.measureType4
      ),
    }).subscribe(
      (res) => {
        this.isLoading = false;
        this.todayStatistics = res.statistics;
        this.measurements = res.lastMeasurements;
        this.line1 = res.measurements1;
        this.line2 = res.measurements2;
        this.line3 = res.measurements3;
        this.line4 = res.measurements4;
        this.maxTemp = res.minMax.map((data) => {
          return {
            name: moment(data.interval).utcOffset(60).format(),
            value: +data.max,
          };
        });

        this.minTemp = res.minMax.map((data) => {
          return {
            name: moment(data.interval).utcOffset(60).format(),
            value: +data.min,
          };
        });

        this.countDays = res.countDays;

        const el = document.getElementById('rides').offsetWidth;
        this.view = [el, 450];
      },
      (err) => {}
    );
  }

  ngOnInit(): void {
    this.dataService.isMenu.subscribe((isMenu) => {
      if (isMenu) {
        setTimeout(() => {
          const el = document.getElementById('rides').offsetWidth;
          console.log(el);
          this.onResize(el);
        }, 501);
      }
    });

    setInterval(() => this.getForecast(), 6000);
    setInterval(() => this.getLastData(), 6000);
  }

  getLastData() {
    this.forecastService.getLastForecast().subscribe((res) => {
      this.measurements = res;
    });
  }

  onResize(num) {
    console.log(num);
    this.view = [num, 450];
  }

  setDates(date) {
    switch (date) {
      case 'today':
        let t = new Date();
        this.dateFrom = new Date().toISOString().split('T')[0];
        this.dateTo = new Date().toISOString().split('T')[0];

        this.modelTo = {
          year: t.getFullYear(),
          month: t.getMonth() + 1,
          day: t.getDate(),
        };
        this.modelFrom = {
          year: t.getFullYear(),
          month: t.getMonth() + 1,
          day: t.getDate(),
        };
        break;
      case 'week':
        let dat = new Date();
        this.dateTo = new Date().toISOString().split('T')[0];
        this.dateFrom = new Date(dat.getTime() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];

        this.modelTo = {
          year: dat.getFullYear(),
          month: dat.getMonth() + 1,
          day: dat.getDate(),
        };

        dat.setDate(dat.getDate() - 7);
        this.modelFrom = {
          year: dat.getFullYear(),
          month: dat.getMonth() + 1,
          day: dat.getDate(),
        };
        break;
      case 'month':
        let datM = new Date();
        this.dateTo = new Date().toISOString().split('T')[0];
        this.dateFrom = new Date(datM.getTime() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];

        this.modelTo = {
          year: datM.getFullYear(),
          month: datM.getMonth() + 1,
          day: datM.getDate(),
        };
        const today = new Date();
        today.setDate(today.getDate() - 30);
        this.modelFrom = {
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate(),
        };
        break;
      default:
        break;
    }
  }

  onDateFromSelect(e) {
    const date = new Date(e.year, e.month - 1, e.day + 1);
    this.dateFrom = date.toISOString().split('T')[0];
  }

  onDateToSelect(e) {
    const date = new Date(e.year, e.month - 1, e.day + 1);
    this.dateTo = date.toISOString().split('T')[0];
  }

  getForecast() {
    this.forecastService
      .getForecast(
        this.sensor,
        this.time.toString(),
        this.dateFrom,
        this.dateTo,
        this.isGapfill,
        this.measureType1
      )
      .subscribe(
        (res) => {
          this.line1 = res;
        },
        (err) => {}
      );

    this.forecastService
      .getForecastLocf(
        this.sensor,
        this.time.toString(),
        this.dateFrom,
        this.dateTo,
        this.measureType2
      )
      .subscribe(
        (res) => {
          this.line2 = res;
        },
        (err) => {}
      );

    this.forecastService
      .getLastMeasurements(
        this.sensor,
        this.time.toString(),
        this.dateFrom,
        this.dateTo,
        this.isGapfill,
        this.measureType3,
        'first'
      )
      .subscribe(
        (res) => {
          this.line3 = res;
        },
        (err) => {}
      );

    this.forecastService
      .getLastMeasurements(
        this.sensor,
        this.time.toString(),
        this.dateFrom,
        this.dateTo,
        this.isGapfill,
        this.measureType4
      )
      .subscribe(
        (res) => {
          this.line4 = res;
        },
        (err) => {}
      );
  }

  getCountDays() {
    this.forecastService
      .getDaysCount(this.overUnder, this.year)
      .subscribe((res) => {
        this.countDays = res;
      });
  }

  measureType = 'meantemp';
  minMaxData() {
    this.forecastService
      .getMinMaxTemperature(this.measureType)
      .subscribe((res) => {
        this.maxTemp = res.map((data) => {
          return {
            name: moment(data.interval).utcOffset(60).format(),
            value: +data.max,
          };
        });

        this.minTemp = res.map((data) => {
          return {
            name: moment(data.interval).utcOffset(60).format(),
            value: +data.min,
          };
        });
      });
  }

  measureType1 = 'meantemp';
  measureType2 = 'meantemp';
  measureType3 = 'meantemp';
  measureType4 = 'meantemp';
  lineGraph1() {
    this.forecastService
      .getForecast(
        this.sensor,
        this.time.toString(),
        this.dateFrom,
        this.dateTo,
        this.isGapfill,
        this.measureType1
      )
      .subscribe((res) => {
        this.line1 = res;
      });
  }
  lineGraph2() {
    this.forecastService
      .getForecastLocf(
        this.sensor,
        this.time.toString(),
        this.dateFrom,
        this.dateTo,
        this.measureType2
      )
      .subscribe((res) => {
        this.line2 = res;
      });
  }
  lineGraph3() {
    this.forecastService
      .getLastMeasurements(
        this.sensor,
        this.time.toString(),
        this.dateFrom,
        this.dateTo,
        this.isGapfill,
        this.measureType3,
        'first'
      )
      .subscribe((res) => {
        this.line3 = res;
      });
  }
  lineGraph4() {
    this.forecastService
      .getLastMeasurements(
        this.sensor,
        this.time.toString(),
        this.dateFrom,
        this.dateTo,
        this.isGapfill,
        this.measureType4
      )
      .subscribe((res) => {
        this.line4 = res;
      });
  }

  getSensorName() {
    let name = 'All sensors';
    switch (this.sensor) {
      case '1':
        name = 'East Sensor';
        break;
      case '2':
        name = 'West Sensor';
        break;
      case '3':
        name = 'North Sensor';
        break;
      case '4':
        name = 'South Sensor';
        break;
      case 'global':
        name = 'Global Sensors';
        break;
      default:
        break;
    }

    return name;
  }
}
