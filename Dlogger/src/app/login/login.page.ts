import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { AuthService } from '../services/user/auth.service';
import { Router } from '@angular/router'
import { AlertController } from '@ionic/angular'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username:string = "";
  password:string = "";
  constructor(
    public afAuth: AngularFireAuth,
    private authService: AuthService,
    public alert: AlertController,
    public router: Router
    ) { }

  ngOnInit() {
  }

 async login() {
    const { username, password } = this
    try {
      this.authService.loginUser(username, password)
      console.log("Login Successful")
      this.router.navigate(['/home'])
    } catch(err) {
      console.dir(err)
      if(err.code == "auth/user-not-found") {
        this.showAlert("Error", "User Not Found")
        console.log("User not found")
      }
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["Ok"]
    })
    await alert.present()
  }

  goToRegister() {
    this.router.navigate(['/register'])
  }

}
