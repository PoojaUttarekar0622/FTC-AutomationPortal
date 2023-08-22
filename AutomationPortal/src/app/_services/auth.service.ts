import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http"
import { map, catchError } from "rxjs/operators"
import { Observable, throwError } from "rxjs";
import { RestService } from "./rest.service"
import { ResponseData } from "../_models/response-data"
import { SessionService } from "./session.service";
import { Aduser } from "../_models/aduser";

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
export class AuthService {

  constructor(private http: HttpClient, private restService: RestService,
    private sessionService: SessionService) {
  }

  isAuthenticated(): boolean {
    let isAuthenticated = this.sessionService.isLoggedInUserSessionDataPresent();

    if (isAuthenticated) {
      let currentUser = this.sessionService.getLoggedInUserDetails();
    }
    return isAuthenticated;
  }

  public signIn(username: string, password: string): Observable<ResponseData> {

    return this.http.post(this.restService.baseUrl + 'Login/Authenticate',
      {
        "userName": username,
        "password": password
      }, httpOptions).pipe(
        map((response: Response) => {
          let responseData = <ResponseData>response;
          this.sessionService.setLoggedInUserDetails(responseData);
          return responseData;
        }),
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          return Observable.throw(error);
        })
      );
  }

  changePassword(jsonChangePwd: any) {
    try {
      return this.http.post(this.restService.baseUrl + 'login/ChangePassword', jsonChangePwd, httpOptions).pipe(
        map((response: Response) => {
          return <ResponseData>response
        }),
        catchError(this.handleError)
      )
    } catch (error) {
      console.log("error", error);
    }
  }

  // Error handling 
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //window.alert('Something bad happened; please try again later.');
    return throwError('Something bad happened; please try again later.');
  }


  public async logout() {
    return this.http.post(this.restService.baseUrl + 'Login/Logout', {"loginName": this.sessionService.getCurrentUserName(), "token": this.sessionService.getToken() }, httpOptions).pipe(
      // ...and calling .json() on the response to return data
      map((response: Response) => {
        console.log(response);
        // let responseData = <ResponseData>response;
        // this.sessionService.setLoggedInUserDetails(responseData);
        // return responseData;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return Observable.throw(error);
      })
    );

    await sessionStorage.removeItem('loggedinUserDetails');
    await sessionStorage.removeItem('logedinUser');
    await sessionStorage.clear();
    return true;
  }

}
