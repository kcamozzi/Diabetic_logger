import { Component, OnInit } from '@angular/core';
import { MenuController, Platform, AlertController } from '@ionic/angular';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.page.html',
  styleUrls: ['./reminders.page.scss'],
})
export class RemindersPage implements OnInit {
  quick_hours: number;
  public schedule_hours: string = "1";
  public schedule_minutes: string = "00";
  public schedule_AMPM: string = "AM";


  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  reminder_type = "quick";
  scheduled = [];

  constructor(
    public menuCtrl: MenuController,
    private plt: Platform,
    private localNotifications: LocalNotifications,
    private alertCtrl: AlertController
    ) {
      this.plt.ready().then(() => {
        this.localNotifications.on('click').subscribe(res => {
          console.log('click: ', res);
          let msg = res.data ? res.data.mydata : '';
          this.showAlert(res.title, res.text, msg);
        });
        
        this.localNotifications.on('trigger').subscribe(res => {

        });
      });
     }

  ngOnInit() {
    this.menuCtrl.close();
  }

  quickNotification() {
    this.localNotifications.schedule({
      id: 1,
      title: 'Quick Reminder',
      text: 'Check your blood glucose',
      data: { mydata: 'This is your reminder to check your blood glucose'},
      trigger: { in: this.hour, unit: ELocalNotificationTriggerUnit.SECOND },
      foreground: true,
    });
    this.showAlert("Reminder Created", "Glucose reminder", "You have created a new quick reminder");
  }

  scheduleNotification() {
    this.localNotifications.schedule({
      id: 22,
      title: 'Glucose Reminder',
      text: 'Check your blood glucose',
      trigger: { at: new Date(this.year, this.month, this.day, this.hour, this.minute) },
      foreground: true
    });
    this.showAlert("Reminder Created", "Glucose reminder", "You have created a new scheduled reminder");
  }

  dailyNotification() {
    this.localNotifications.schedule({
      id: 42,
      title: 'Daily Reminder',
      text: 'Daily blood glucose reminder',
      trigger: { every: { hour: this.hour, minute: this.minute}, count: 1 },
      foreground: true
    });
    this.showAlert("Reminder Created", "Glucose reminder", "You have created a new daily reminder");
  }

  getAll() {
    this.localNotifications.getAll().then(res => {
      this.scheduled = res;
    })
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

  updateHours(hours: string)
  {
    this.hour = +hours;
    console.log("Hour:");
    console.log(this.hour);
  }

  clearAllNotificaitons()
  {
    this.localNotifications.cancelAll();
    this.showAlert("Alert:", "Cancel All Notifications", "You have cancelled all of your notifications");
  }


}
