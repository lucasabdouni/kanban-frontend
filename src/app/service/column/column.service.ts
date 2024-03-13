import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import { GetAllColumnsResponse } from 'src/app/models/interface/column/GetAllColumnsResponse';

@Injectable({
  providedIn: 'root',
})
export class ColumnService {
  private JWT_TOKEN = this.cookieService.get('token');
  private headers = {
    Authorization: `Bearer ${this.JWT_TOKEN}`,
  };

  constructor(private apollo: Apollo, private cookieService: CookieService) {}

  getAllColumns(): Observable<Array<GetAllColumnsResponse>> {
    const query = gql`
      query GetAllColumns {
        columns {
          id
          title
        }
      }
    `;

    return this.apollo
      .query<Array<GetAllColumnsResponse>>({
        query: query,
        context: {
          headers: this.headers,
        },
      })
      .pipe(
        map((result: any) => result.data.columns as GetAllColumnsResponse[])
      );
  }
}
