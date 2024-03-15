import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import { CreateColumnRequest } from 'src/app/models/interface/column/request/createColumnRequest';
import { EditColumnRequest } from 'src/app/models/interface/column/request/editColumnRequest';
import { GetAllColumnsResponse } from 'src/app/models/interface/column/response/GetAllColumnsResponse';

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

  createColumn({
    title,
  }: CreateColumnRequest): Observable<GetAllColumnsResponse> {
    {
      return this.apollo
        .mutate({
          mutation: gql`
            mutation CreateColumn($title: String!) {
              createColumn(data: { title: $title }) {
                id
                title
              }
            }
          `,
          variables: {
            title,
          },
          context: {
            headers: this.headers,
          },
        })
        .pipe(
          map(
            (result: any) => result.data.createColumn as GetAllColumnsResponse
          )
        );
    }
  }

  editColumn({
    id,
    title,
  }: EditColumnRequest): Observable<GetAllColumnsResponse> {
    {
      return this.apollo
        .mutate({
          mutation: gql`
            mutation updateColumn($id: String!, $title: String!) {
              updateColumn(id: $id, data: { title: $title }) {
                id
                title
              }
            }
          `,
          variables: {
            title,
            id,
          },
          context: {
            headers: this.headers,
          },
        })
        .pipe(
          map(
            (result: any) => result.data.updateColumn as GetAllColumnsResponse
          )
        );
    }
  }

  deleteColumn(id: string): Observable<boolean> {
    {
      return this.apollo
        .mutate({
          mutation: gql`
            mutation deleteColumn($id: String!) {
              deleteColumn(id: $id)
            }
          `,
          variables: {
            id,
          },
          context: {
            headers: this.headers,
          },
        })
        .pipe(map((result: any) => result.data.deleteColumn as boolean));
    }
  }
}
