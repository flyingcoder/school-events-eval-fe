import { Component, OnInit, Input } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {

 @Input() values;
 public pieChartOptions: ChartOptions = {
   responsive: true,
 };
 public pieChartLabels: Label[] = [['Poor'], ['Fair'], ['Good'], ['Very Good'], 'Excellent'];
 //public pieChartData: SingleDataSet = this.values;
 public pieChartType: ChartType = 'pie';
 public pieChartLegend = true;
 public pieChartPlugins = [];


}
