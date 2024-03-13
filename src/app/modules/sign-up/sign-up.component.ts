import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { createUserRequest } from 'src/app/models/interface/user/signUp/createUserRequest';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  private destroy$ = new Subject<void>();

  createUserForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  onSubmitcreateUserForm(): void {
    if (this.createUserForm.value && this.createUserForm.valid) {
      this.userService
        .create(this.createUserForm.value as createUserRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.router.navigate(['/']);
              console.log(response);
            }
          },
          error: (error) => {
            if (error.message === 'E-mail already registered.') {
              console.log(error.message);
            }

            console.log(error.message);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
