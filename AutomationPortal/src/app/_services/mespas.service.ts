import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ResponseData } from "../_models/response-data"
import { retry, catchError, map } from 'rxjs/operators';
import { ReturnStatement } from '@angular/compiler';
import { SessionService } from "./session.service";

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
export class MespasService {
    constructor(private http: HttpClient,
        private restService: RestService,
        private sessionService: SessionService) { }

    getStorepartData(): Observable<ResponseData> {
        return this.http.get(this.restService.baseUrl + 'MESPASEvent/GetSNQItemsList', httpOptions).pipe(
            map((response: Response) => {
                return <ResponseData>response
            }),
            catchError(this.handleError)
        )
    }

    saveStoreDate(jsonSave: any) {
        try {
            return this.http.post(this.restService.baseUrl + 'MESPASEvent/SaveSNQItems', jsonSave, httpOptions).pipe(
                map((response: Response) => {
                    return <ResponseData>response
                }),
                catchError(this.handleError)
            )
        } catch (error) {
            console.log("error", error);
        }
    }

    deleteStoreData(jsonSave: any) {
        try {
            return this.http.post(this.restService.baseUrl + 'MESPASEvent/DeleteSNQItems', jsonSave, httpOptions).pipe(
                map((response: Response) => {
                    return <ResponseData>response
                }),
                catchError(this.handleError)
            )
        } catch (error) {
            console.log("error", error);
        }
    }

    getSparepartData(): Observable<ResponseData> {
        return this.http.get(this.restService.baseUrl + 'MESPASEvent/GetMSDItemsList', httpOptions).pipe(
            map((response: Response) => {
                return <ResponseData>response
            }),
            catchError(this.handleError)
        )
    }

    saveSpareDate(jsonSave: any) {
        try {
            return this.http.post(this.restService.baseUrl + 'MESPASEvent/SaveMSDItems', jsonSave, httpOptions).pipe(
                map((response: Response) => {
                    return <ResponseData>response
                }),
                catchError(this.handleError)
            )
        } catch (error) {
            console.log("error", error);
        }
    }

    deleteSpareData(jsonSave: any) {
        try {
            return this.http.post(this.restService.baseUrl + 'MESPASEvent/DeleteMsdItems', jsonSave, httpOptions).pipe(
                map((response: Response) => {
                    return <ResponseData>response
                }),
                catchError(this.handleError)
            )
        } catch (error) {
            console.log("error", error);
        }
    }

    getDepartment(): Observable<ResponseData> {
        return this.http.get(this.restService.baseUrl + 'MESPASEnquiry/GetDepartmentData', httpOptions).pipe(
            map((response: Response) => {
                return <ResponseData>response
            }),
            catchError(this.handleError)
        )
    }

    getMespasSummary(statusId: number): Observable<ResponseData> {
        return this.http.get(this.restService.baseUrl + 'MESPASEnquiry/Summary/' + statusId, httpOptions).pipe(
            map((response: Response) => {
                return <ResponseData>response
            }),
            catchError(this.handleError)
        )
    }

    getMespasDetails(hdrId: string): Observable<ResponseData> {
        return this.http.post(this.restService.baseUrl + 'MESPASEnquiry/Details', { "PK_MESPASENQUIRY_HDR_ID": hdrId }, httpOptions).pipe(
            map((response: Response) => {
                return <ResponseData>response
            }),
            catchError(this.handleError)
        )
    }

    mespasNotstarted(req: object): Observable<ResponseData> {
        return this.http.post(this.restService.baseUrl + 'MESPASEnquiry/NotStartedtaskEnquiryList', req, httpOptions).pipe(
            map((response: Response) => {
                let responseData = <ResponseData>response;
                return responseData;
            }),

            catchError((error: HttpErrorResponse) => {

                return Observable.throw(error);
            })
        );
    }

    mespasUpdateData(jsonSave: any) {
        try {
            return this.http.post(this.restService.baseUrl + 'MESPASEnquiry/UpdateData', jsonSave, httpOptions).pipe(
                map((response: Response) => {
                    return <ResponseData>response
                }),
                catchError(this.handleError)
            )
        } catch (error) {
            console.log("error", error);
        }
    }

    mespasDelete(jsonDelete: any) {
        try {
            return this.http.post(this.restService.baseUrl + 'MESPASEnquiry/DeleteItem', jsonDelete, httpOptions).pipe(
                map((response: Response) => {
                    return <ResponseData>response
                }),
                catchError(this.handleError)
            )
        } catch (error) {
            console.log("error", error);
        }
    }

    mespasSaveAsDraft(jsonSave: any) {
        try {
          return this.http.post(this.restService.baseUrl + 'MESPASEnquiry/UpdateSaveAsData', jsonSave, httpOptions).pipe(
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
}