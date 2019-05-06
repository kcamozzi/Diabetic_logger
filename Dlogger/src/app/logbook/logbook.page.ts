import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-logbook',
  templateUrl: './logbook.page.html',
  styleUrls: ['./logbook.page.scss'],
})
export class LogbookPage implements OnInit {

  glucoseValues = new Map();
  glucoseHighLow = new Map();
  lineChartData;
  myChart: Chart;
  hourString: string;
  hourString2: string;
  hour: number = 0;
  targetLow = 100;
  targetHigh = 160;
  @ViewChild('chartContainer') chartcontainer: ElementRef;
  @ViewChild('chartcanvas') chartcanvas: ElementRef;
  dailyData = [];
  constructor(
    public menuCtrl: MenuController,
    public storage: Storage
    ) { }

  ngOnInit() {
    this.menuCtrl.close();

    Promise.all([
      this.retrieveMap(),
    ]);
    this.fillGraph();
    this.createChart();
    this.highLowMapFill();

  }

  test(){
    console.log(this.glucoseValues);
  }

  fillGraph() {

    this.lineChartData = {
      chartType: 'ScatterChart',
      data: [
        [0,0],
        [2,3]
      ],
      columnNames: ['Time', 'Glucose'],
      options: {
      'title': 'Time vs Glucose',
      'width': 400,
      'height': 300
      }
    };
  }

  createChart() {   
    this.myChart = new Chart(this.chartcanvas.nativeElement, {
      type: 'scatter',
      data: {
        labels: ['scatter test'],
        datasets: [{
          label: 'Time vs Glucose',
          data: this.dailyData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: true,
        scales: {
          yAxes: [{
            type: 'linear',
            ticks: {
              suggestedMin: 0,
              suggestedMax: 500,
              stepSize: 50
          }
        }],
          xAxes: [{
              type: 'linear',
              position: 'bottom',
              ticks: {
                suggestedMin: 0,
                suggestedMax: 12,
                stepSize: 1
            }
          }]
      }
      }
    });
  }

   mapToDataDaily() {
    Array.from(this.glucoseValues.entries()).forEach(
      entry => this.entryProcess(entry[0], entry[1])
      );

    this.myChart.update();
    }

    entryProcess(entryKey: string, entryValue: number) {
      this.hourString = entryKey.toString();
      console.log("hour string is ", this.hourString);
      this.hourString2 = this.hourString.slice(15,-6);
      console.log("hour string sliced is ", this.hourString2);
      this.hour = +this.hourString2;
      console.log("number hour is ", this.hour);
      console.log(entryKey);
      if(this.hour > 12)
      {
        this.hour = this.hour - 12;
      }
      console.log(this.hour, entryValue);
      this.dailyData.push({x: this.hour, y: entryValue});
    }

    mapToHighLow(data) {
      Array.from(data.entries()).forEach(
        entry => this.highLowEntry(entry[0], entry[1])
        );
    }

    highLowEntry(entryKey: string, entryValue: number) {
      if(entryValue > this.targetHigh)
      {
        this.glucoseHighLow.set(entryKey, "High");
      }
      else if(entryValue < this.targetLow)
      {
        this.glucoseHighLow.set(entryKey, "Low");
      }
      else
      {
        this.glucoseHighLow.set(entryKey, "In Range");
      }
    }

    clearLocalStorage() {
      this.storage.clear();
    }

    retrieveMap() {
      this.storage.get('myMap').then((data) => {
        this.glucoseValues = data;
      });
    }

    highLowMapFill() {
      this.storage.get('myMap').then((data) => this.mapToHighLow(data));
    }

    checkMapGot() {
      this.mapToDataDaily();
      console.log(this.dailyData);
      console.log(this.glucoseHighLow);
    }
}
