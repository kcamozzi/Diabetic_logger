import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Router } from '@angular/router'
import { AlertController } from '@ionic/angular'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public alert: AlertController,
    public router: Router
  ) {}

  loginUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(err => {
      if(err.code == "auth/user-not-found") {
        this.showAlert("Error", "User Not Found")
        console.log("User not found")
      }
      if(err.code == "auth/wrong-password") {
        this.showAlert("Error", "Password incorrect")
        console.log("Password incorrect")
      }
      console.error(err);
      throw new Error(err);
    });
    
  }

  signupUser(email: string, password: string): Promise<void> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((newUserCredential: firebase.auth.UserCredential) => {
        firebase
          .firestore()
          .doc(`/userProfile/${newUserCredential.user.uid}`)
          .set({ email });
          this.showAlert("Welcome!", "Successfully created account!");
      })
      .catch(err => {
        if(err.code == "auth/invalid-email") {
          this.showAlert("Error", "Invalid Email")
          console.log("Invalid Email")
        }
        console.error(err);
        throw new Error(err);
      });
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["Ok"]
    })
    await alert.present()
  }
}