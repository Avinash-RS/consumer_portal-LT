import { Input } from "@angular/core";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
} from 'chart.js';

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);

@Component({
  selector: "app-barChart",
  templateUrl: "./barChart.component.html",
  styleUrls: ["./barChart.component.scss"]
})

export class BarChartComponent implements OnInit {
  canvas: any;
  ctx: any;
  @ViewChild('myChart') private chartContainer: ElementRef;
  @Input('chartType') type: any;
  @Input('values') chartValues: any;
  @Input('labels') chartLabels: any;
  @Input('orientation') orient: any = "'x'"

  constructor() {

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.canvas = this.chartContainer.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    let chartdata:any = {
      labels: this.chartLabels,
      datasets: [{
        label: 'Skill Score',
        data: this.chartValues,
        backgroundColor: this.type === "radar" ? 'rgba(54, 162, 235, 0.2)' : ["#FF8C00", "#0085B6" , "#9DBC5B" , "#28B59A", "#03B8CB"],
      borderWidth: 1,
      borderRadius:20
      }]
  }
  // this.type==="radar"?chartdata.datasets[0].fillColor = "rgba(255,10,13,255)":''
    let myChart = new Chart(this.ctx, {
    type: this.type,
    data:chartdata,
    options: {
    indexAxis: this.orient,
  }
    });
  
  }
  
}
