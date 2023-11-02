import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {
  form: FormGroup;
  columnOneData = ["First Name"]

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
