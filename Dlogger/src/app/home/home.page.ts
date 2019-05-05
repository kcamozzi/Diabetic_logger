import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { ProfileService } from '../services/user/profile.service';
import { AuthService } from '../services/user/auth.service';
import { isNumber } from 'util';
import { Storage } from '@ionic/storage';
import { ValueAccessor } from '@ionic/angular/dist/directives/control-value-accessors/value-accessor';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public userProfile: any;
  glucoseValues = new Map();
  value = "0";
  input_type = "current";
  newValue = true;
  numValue: number = 0;
  inputString: string;
  currentDate: string;
  currentDateShort: string;
  customDate: string;
  customDateShort: string;
  month: number;
  day: number;
  year: number;
  hour: number;
  minute: number;
  numbers = 
  [[1,2,3],
   [4,5,6],
   [7,8,9],
   [0],
   ["CLR", "Enter"]];

  constructor(
    public menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router,
    public storage: Storage
  ) { }

  ngOnInit() {
      this.profileService
    .getUserProfile()
    .get()
    .then(userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.data();
    });  
  }

  onButtonPress(input, inputType: string) {
    if(isNumber(input))
    {
      if(this.value.length < 3)
      {
        if(this.newValue == true)
        {
          this.value = '' + input;
        }
        else
        {
          this.value += '' + input;
        }
        this.newValue = false;
      }
    }
    if(input === "CLR")
    {
      this.value = "0";
      this.newValue = true;
    }

    if(input === "Enter")
    {
      if(inputType === "current")
      {
        this.numValue = +this.value;
        this.currentDate = new Date().toString();
        this.currentDateShort = this.currentDate.slice(0,24);
        this.glucoseValues.set(this.currentDateShort, this.numValue);
        this.storage.set('myMap', this.glucoseValues);
        this.showAlert("Glucose Entry","You've entered a new glucose value!","Value: " + this.numValue);
        this.numValue = 0;
        this.value = "0";
        this.newValue = true;
        console.log(this.glucoseValues);
      }
      if(inputType === "custom")
      {
        this.numValue = +this.value;
        this.customDate = new Date(this.year, this.month, this.day, this.hour, this.minute).toString();
        this.customDateShort = this.customDate.slice(0,24);
        //console.log(this.customDateShort, this.numValue);
        this.glucoseValues.set(this.customDateShort, this.numValue);
        this.storage.set('myMap', this.glucoseValues);
        this.showAlert("Glucose Entry","You've entered a new glucose value!","Value: " + this.numValue);
        this.numValue = 0;
        this.value = "0";
        this.newValue = true;
        console.log(this.glucoseValues);
      }
    }
  }

  showAlert(header, sub, msg) {
    this.alertCtrl.create({
      header: header,
      subHeader: sub,
      message: msg,
      buttons: ['Ok']
    }).then(alert => alert.present());
  }

  updateDate(date_string: string){
    this.month = +date_string.slice(5,-3);
    this.month = this.month - 1;
    this.day = +date_string.slice(8);
    this.year = +date_string.slice(0,-6);
    console.log("Date string:");
    console.log(date_string);
    console.log("Month:");
    console.log(this.month);
    console.log("Day:");
    console.log(this.day);
    console.log("Year:");
    console.log(this.year);
  }

  updateTime(hours: string, minutes: string, AMPM: string)
  {
    this.hour = +hours;
    this.minute = +minutes;
    if(AMPM === "PM")
    {
      this.hour = this.hour + 12;
    }
    console.log("Hour:");
    console.log(this.hour);
    console.log("Minute:");
    console.log(this.minute);
  }
}