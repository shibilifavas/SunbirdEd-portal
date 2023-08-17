import { Component, OnInit } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../services/login/auth.service';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss']
})
export class RegistrationPageComponent implements OnInit {

  constructor(private authService: AuthService) { }

  slideIndex = 1;
  registerErrorMessage = '';
  registerSuccessMessage = '';
  firstNameFieldError = false;
  lastNameFieldError = false;
  usernameFieldError = false;
  emailFieldError = false;
  passwordFieldError = false;
  confirmPasswordFieldError = false;

  ngOnInit(): void {
    this.showSlides(this.slideIndex);
    setInterval(() => { this.plusSlides(1) }, 3000);
  }

  register() {
    let firstName: any = document.getElementById("first_name");
    let lastName: any = document.getElementById("last_name");
    let email: any = document.getElementById("email");
    let username: any = document.getElementById("username");
    let password: any = document.getElementById("password");
    let confirmPassword: any = document.getElementById("confirm_password");

    // Validation block

    this.firstNameFieldError = false;
    this.lastNameFieldError = false;
    this.usernameFieldError = false;
    this.emailFieldError = false;
    this.passwordFieldError = false;
    this.confirmPasswordFieldError = false
    if (firstName.value === "" && lastName.value === "" && username.value === "" && password.value === "") {
      this.registerErrorMessage = "All the fields are required";
      this.firstNameFieldError = true;
      this.lastNameFieldError = true;
      this.usernameFieldError = true;
      this.emailFieldError = true;
      this.passwordFieldError = true;
      this.confirmPasswordFieldError = true
    } else if (firstName.value === "") {
      this.firstNameFieldError = true;
      this.registerErrorMessage = "Please enter first name";
    } else if (lastName.value === "") {
      this.lastNameFieldError = true;
      this.registerErrorMessage = "Please enter last name";
    } else if (email.value === "") {
      this.emailFieldError = true;
      this.registerErrorMessage = "Please enter email id";
    } else if (username.value === "") {
      this.usernameFieldError = true;
      this.registerErrorMessage = "Please enter username";
    } else if (password.value === "") {
      this.passwordFieldError = true;
      this.registerErrorMessage = "Please enter password";
    } else if (password.value === "") {
      this.confirmPasswordFieldError = true;
      this.registerErrorMessage = "Please confirm password";
    } else if (password.value !== confirmPassword.value) {
      this.passwordFieldError = true;
      this.confirmPasswordFieldError = true;
      this.registerErrorMessage = "Password & confirm password does not match";
    } else {
      this.registerErrorMessage = "";
    }

    if (this.registerErrorMessage !== "") {
      return;
    }

    const data = {
      request: {
        firstName: firstName.value,
        lastName: lastName.value,
        userName: username.value,
        email: email.value,
        emailVerified: true,
        password: password.value
      }
    }
    this.authService.register(data).pipe(catchError(error => {
      // const statusCode = error.status;
      this.registerErrorMessage = error.error.params.errmsg;
      return throwError(error);
    })
    ).subscribe(res => {
      firstName.value = "";
      lastName.value = "";
      email.value = "";
      username.value = "";
      password.value = "";
      confirmPassword.value = "";
      this.registerSuccessMessage = "Registration successfull, please login."
      console.log('Register', res);
    })
  }

  // Next/previous controls
  plusSlides(n: any) {
    this.showSlides(this.slideIndex += n);
  }

  // Thumbnail image controls
  currentSlide(n: any) {
    this.showSlides(this.slideIndex = n);
  }

  showSlides(n: any) {
    let i: any;
    let slides: any = document.getElementsByClassName("mySlides");
    let dots: any = document.getElementsByClassName("dot");
    if (n > slides.length) { this.slideIndex = 1 }
    if (n < 1) { this.slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[this.slideIndex - 1].style.display = "block";
    dots[this.slideIndex - 1].className += " active";
  }

}
