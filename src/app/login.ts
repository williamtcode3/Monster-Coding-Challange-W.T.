import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { sendPasswordResetEmail } from '@angular/fire/auth';


import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginPage {
  showEmail = false;
  AccountCreation = false;

  loginEmail = '';
  loginPassword = '';

  loginError = '';

  createEmail = '';
  createPassword = '';
  confirmPassword = '';

  passwordTouched = false;
  confirmTouched = false;

  passwordInvalid = true;
  passwordsMismatch = true;

  private passwordRegex = /^(?=.*\d)(?=.*[^\w\s]).{8,16}$/;

  showVerifyModal = false;
  verifyModalMessage = 'Please check your email for the verification link to proceed.';

  constructor(
    private auth: Auth,
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  onPasswordInput() {
    this.passwordTouched = true;
    this.passwordInvalid = !this.passwordRegex.test(this.createPassword);
    this.passwordsMismatch = this.confirmPassword !== this.createPassword;
  }

  onConfirmInput() {
    this.confirmTouched = true;
    this.passwordsMismatch = this.confirmPassword !== this.createPassword;
  }

async signIn() {
  const email = this.loginEmail.trim();

  try {
    const cred = await signInWithEmailAndPassword(this.auth, email, this.loginPassword);

    if (!cred.user.emailVerified) {
      return;
    }

    this.zone.run(() => {
      this.loginError = '';
    });
    this.cdr.detectChanges();

    this.router.navigateByUrl('/form');
  } catch {
    this.zone.run(() => {
      this.loginError = 'Incorrect Username / Password. Please Try again';
    });
    this.cdr.detectChanges();
  }
}



  async createAccount() {
    const email = this.createEmail.trim();

    try {
      const cred = await createUserWithEmailAndPassword(this.auth, email, this.createPassword);
      await sendEmailVerification(cred.user);

      this.zone.run(() => {
        this.showVerifyModal = true;
        this.AccountCreation = false;
      });

      this.cdr.detectChanges();
    } catch {
      return;
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);

      this.router.navigateByUrl('/form');
    } catch {
      return;
    }
  }

async forgotPassword() {
  const email = this.loginEmail.trim();

  if (!email) {
    this.zone.run(() => {
      this.loginError = 'Enter your email first.';
    });
    this.cdr.detectChanges();
    return;
  }

  try {
    await sendPasswordResetEmail(this.auth, email);

    this.zone.run(() => {
      this.loginError = 'Password reset email sent.';
    });
    this.cdr.detectChanges();
  } catch {
    this.zone.run(() => {
      this.loginError = 'Unable to send reset email.';
    });
    this.cdr.detectChanges();
  }
}

}
