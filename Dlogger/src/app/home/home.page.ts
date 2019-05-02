import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { ProfileService } from '../services/user/profile.service';
import { AuthService } from '../services/user/auth.service';
import { isNumber } from 'util';
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
  newValue = true;
  numValue: number = 0;
  inputString: string;
  currentDate: string;
  currentDateShort: string;
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
    private router: Router
  ) { }

  ngOnInit() {
     this.profileService
    .getUserProfile()
    .get()
    .then(userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.data();
    }); 
  }

  onButtonPress(input) {
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
      this.numValue = +this.value;
      this.currentDate = new Date().toString();
      this.currentDateShort = this.currentDate.slice(0,24);
      this.glucoseValues.set(this.currentDateShort, this.numValue);
      this.showAlert("Glucose Entry","You've entered a new glucose value!","Value: " + this.numValue);
      this.numValue = 0;
      this.value = "0";
      this.newValue = true;
      console.log(this.glucoseValues);
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
}