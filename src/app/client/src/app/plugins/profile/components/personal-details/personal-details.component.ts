import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {
  form: FormGroup;
  formData = {"colOne":{"fields":[{"label":"First name","value":"firstName"},{"label":"Middle name","value":"middleName"},{"label":"Surname","value":"surname"},{"label":"Date of birth (dd-mm-yy)","value":"dob"},{"label":"Nationality","value":"nationality"}],"radio":[{"label":"Gender","value":"gender","items":[{"label":"Male","value":"male"},{"label":"Female","value":"female"},{"label":"Others","value":"others"}]},{"label":"Marital status","value":"maritalStatus","items":[{"label":"Single","value":"single"},{"label":"Married","value":"married"}]},{"label":"Category","value":"category","items":[{"label":"General","value":"general"},{"label":"OBC","value":"obc"},{"label":"SC","value":"sc"},{"label":"ST","value":"st"}]}]},"colTwo":{"fields":[{"label":"Domicile Medium (Mother Tongue)","value":"motherTongue"},{"label":"Other languages known","value":"otherLanguages"},{"label":"Mobile number","value1":"code","value2":"mobile"},{"label":"Telephone number","value":"telephone"},{"label":"Primary email","value":"primaryEmail"},{"label":"Secondary email","value":"secondaryEmail"},{"label":"Postal address","value":"postalAddress"},{"label":"Pincode","value":"pincode"}]}}

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      middleName: [''],
      surname: ['', Validators.required],
      dob: ['', Validators.required],
      nationality: ['', Validators.required],
      gender: ['', Validators.required],
      maritalStatus: [''],
      category: ['', Validators.required],
      motherTongue: ['', Validators.required],
      otherLanguages: ['', Validators.required],
      mobile: ['', Validators.required],
      telephone: [''],
      primaryEmail: ['', Validators.required],
      secondaryEmail: ['', Validators.required],
      postalAddress: ['', Validators.required],
      pincode: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form submitted!', this.form.value);
      // Handle form submission here
    }
  }

}
