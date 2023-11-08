import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {UserService} from '@sunbird/core';
import {IUserData} from '@sunbird/shared';
import { ProfileService } from '@sunbird/profile';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {
  form: FormGroup;
  formData = {"colOne":{"fields":[{"label":"First name","value":"firstName"},{"label":"Surname","value":"surname"},{"label":"Mobile number","value1":"code","value2":"mobile"},{"label":"Primary email","value":"primaryEmail"},{"label":"Secondary email","value":"secondaryEmail"}],"radio":[]},"colTwo":{}}
  userProfile: any;

  constructor(private formBuilder: FormBuilder, public userService: UserService, private profileService: ProfileService,) { }

  ngOnInit(): void {
    this.userService.userData$.subscribe((user: IUserData) => {
      if (user.userProfile) {
        this.userProfile = user.userProfile;
      }
    });
    console.log("user profile", this.userProfile);
    this.form = this.formBuilder.group({
      firstName: [this.userProfile.firstName, Validators.required],
      surname: [this.userProfile.lastName, Validators.required],
      mobile: [this.userProfile.phone, Validators.required],
      primaryEmail: [{value: this.userProfile.email, disabled: true}, Validators.required],
      secondaryEmail: ['', Validators.required]
    });
  }

  onSubmit(request) {
    if (this.form.valid) {
      console.log('Form submitted!', this.form.value);
      this.profileService.updatePrivateProfile(request).subscribe(res => {
        console.log("res",res);
    })
    }
  }

}
