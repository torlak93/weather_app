import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NavigationComponent } from "./navigation/navigation.component";
import { ModalComponent } from './modal/modal.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { AppSpinnerDirective } from "./spinner/app-spinner.directive";
import { TodayStatisticsComponent } from './components/today-statistics/today-statistics.component';
import { LineGraphComponent } from "./components/line-graph/line-graph.component";
import { LastMeasurementsComponent } from './components/last-measurements/last-measurements.component';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';

@NgModule({
  declarations: [
    NavigationComponent,
    ModalComponent,
    SpinnerComponent,
    AppSpinnerDirective,
    TodayStatisticsComponent,
    LineGraphComponent,
    LastMeasurementsComponent,
    PieChartComponent,
    BarChartComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    NgxChartsModule
  ],
  entryComponents: [
    
  ],
  exports: [
    NavigationComponent,
    AppSpinnerDirective,
    TodayStatisticsComponent,
    LineGraphComponent,
    LastMeasurementsComponent,
    PieChartComponent,
    BarChartComponent
  ]
})
export class SharedModule { }
