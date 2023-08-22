import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http"
import { map, catchError } from "rxjs/operators"
import { Observable, throwError } from "rxjs";
import { RestService } from "./rest.service"
import { SessionService } from "./session.service";
import { ResponseData } from "../_models/response-Data"

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'content': "application/json",
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http: HttpClient, 
    private restService: RestService,
    private sessionService: SessionService
  ) { }

    public getStatusCountMSD(req:object): Observable<ResponseData> {
      return this.http.post(this.restService.baseUrl + 'Task/GetStatusCountForMSD', req, httpOptions).pipe(
        // ...and calling .json() on the response to return data
        map((response: Response) => {
          let responseData = <ResponseData>response; 
          return responseData;
          //return response;
        }),
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          return Observable.throw(error);
        })
      );
    }
   

    public getStatusCountSNQ (req:object): Observable<ResponseData> {
      return this.http.post(this.restService.baseUrl + 'Task/GetStatusCountForSNQ', req, httpOptions).pipe(
        // ...and calling .json() on the response to return data
        map((response: Response) => {
          let responseData = <ResponseData>response; 
          return responseData;
          //return response;
        }),
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          return Observable.throw(error);
        })
      );
    }
 
}
