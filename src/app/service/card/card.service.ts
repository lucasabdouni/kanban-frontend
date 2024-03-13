import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import { GetAllCardsResponse } from 'src/app/models/interface/card/GetAllCardsResponse';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private JWT_TOKEN = this.cookieService.get('token');
  private headers = {
    Authorization: `Bearer ${this.JWT_TOKEN}`,
  };

  constructor(private apollo: Apollo, private cookieService: CookieService) {}

  getAllCards(): Observable<Array<GetAllCardsResponse>> {
    const query = gql`
      query GetAllCards {
        cards {
          id
          title
          description
          columnsTable {
            id
          }
          user {
            id
            name
          }
        }
      }
    `;

    return this.apollo
      .query<Array<GetAllCardsResponse>>({
        query: query,
        context: {
          headers: this.headers,
        },
      })
      .pipe(map((result: any) => result.data.cards as GetAllCardsResponse[]));
  }
}
