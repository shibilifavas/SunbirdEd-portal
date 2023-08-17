import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/login/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(private authService: AuthService) { }

  slideIndex = 1;
  loginErrorMessage = '';
  emailFieldError = false;
  passwordFieldError = false

  ngOnInit(): void {
    this.showSlides(this.slideIndex);
    setInterval(() => { this.plusSlides(1) }, 3000);
  }

  login() {
    let username: any = document.getElementById("username");
    let password: any = document.getElementById("password");

    // Validation block

    this.emailFieldError = false;
    this.passwordFieldError = false;
    if (username.value === "" && password.value === "") {
      this.loginErrorMessage = "Please enter email & password";
      this.emailFieldError = true;
      this.passwordFieldError = true;
    } else if (username.value === "") {
      this.emailFieldError = true;
      this.loginErrorMessage = "Please enter email";
    } else if (password.value === "") {
      this.passwordFieldError = true;
      this.loginErrorMessage = "Please enter password";
    } else {
      this.loginErrorMessage = "";
    }

    // let data:object = {
    //   client_id: "lms",
    //   client_secret: "8cb9c6d8-5307-4f85-8336-1e56157a2976",
    //   grant_type: "password",
    //   username: email.value,
    //   password: password.value
    // }
    const formData = new FormData();
    formData.append('client_id', 'lms');
    formData.append('client_secret', '8cb9c6d8-5307-4f85-8336-1e56157a2976');
    formData.append('grant_type', 'password');
    formData.append('username', username.value);
    formData.append('password', password.value);
    this.authService.login(formData).subscribe(res => {

      console.log('login', res);
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
