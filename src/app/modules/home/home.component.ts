import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  loginForm = this.formBuilder.group({
    email: ['', Validators.required, ''],
    password: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder) {}

  onSubmitLoginForm(): void {
    console.log(this.loginForm.value);
    console.log(this.loginForm.valid);
  }
}
