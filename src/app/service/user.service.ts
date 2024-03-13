import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import { AuthRequest } from '../models/interface/user/auth/AuthRequest';
import { AuthResponse } from '../models/interface/user/auth/AuthResponse';
import { createUserRequest } from '../models/interface/user/signUp/createUserRequest';
import { createUserResponse } from '../models/interface/user/signUp/createUserResponse';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apollo: Apollo, private cookie: CookieService) {}

  auth({ email, password }: AuthRequest): Observable<AuthResponse> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation Login($email: String!, $password: String!) {
            login(data: { email: $email, password: $password }) {
              user {
                id
                name
                email
              }
              token
            }
          }
        `,
        variables: {
          email,
          password,
        },
      })
      .pipe(map((result: any) => result.data.login as AuthResponse));
  }

  create({
    name,
    email,
    password,
  }: createUserRequest): Observable<createUserResponse> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation CreateUser(
            $name: String!
            $email: String!
            $password: String!
          ) {
            createUser(
              data: { name: $name, email: $email, password: $password }
            ) {
              id
              name
              email
            }
          }
        `,
        variables: {
          name,
          email,
          password,
        },
      })
      .pipe(map((result: any) => result.data.createUser as createUserResponse));
  }

  isLoggedIn(): boolean {
    const JWT_TOKEN = this.cookie.get('token');
    return JWT_TOKEN ? true : false;
  }
}
