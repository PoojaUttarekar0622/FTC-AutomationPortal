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
export class SnqService {

  constructor(private http: HttpClient, 
    private restService: RestService, 
    private sessionService: SessionService) { }

    getPortMapping(): Observable<ResponseData> {
      return this.http.get(this.restService.baseUrl + 'SNQEnquiry/GetPortMappingData', httpOptions).pipe(
        map((response: Response) => {
          return <ResponseData>response
        }),
        catchError(this.handleError)
      )
    }

  // Get all story contact BY Login user service call
  getStatusSummary(statusId: number): Observable<ResponseData> {

    return this.http.get(this.restService.baseUrl + 'snqEnquiry/Summary/' + statusId, httpOptions).pipe(
      map((response: Response) => {
        return <ResponseData>response
      }),
      catchError(this.handleError)
    )
  }

  getMSDStatusSummary(statusId: number): Observable<ResponseData> {

    return this.http.get(this.restService.baseUrl + 'MSDEnquiry/Summary/' + statusId, httpOptions).pipe(
      map((response: Response) => {
        return <ResponseData>response
      }),
      catchError(this.handleError)
    )
  }

  getSNQDetails(hdrId: string): Observable<ResponseData> {
    return this.http.post(this.restService.baseUrl + 'snqEnquiry/Details', { "PK_SNQENQUIRY_HDR_ID": hdrId }, httpOptions).pipe(
      map((response: Response) => {
        return <ResponseData>response
      }),
      catchError(this.handleError)
    )
  }

  getMSDDetails(hdrId: string): Observable<ResponseData> {
    return this.http.post(this.restService.baseUrl + 'MSDEnquiry/Details', { "PK_MSDENQUIRY_HDR_ID": hdrId }, httpOptions).pipe(
      map((response: Response) => {
        return <ResponseData>response
      }),
      catchError(this.handleError)
    )
  }


  snqUpdateData(jsonSave: any) {
    try {
      return this.http.post(this.restService.baseUrl + 'SNQEnquiry/UpdateData', jsonSave, httpOptions).pipe(
        map((response: Response) => {
          return <ResponseData>response
        }),
        catchError(this.handleError)
      )
    } catch (error) {
      console.log("error", error);
    }
  }

  updateCustomerDate(jsonUpdate: any) {
    try {
      return this.http.post(this.restService.baseUrl + 'ChangeCustomerSettings/UpdateCustomerData', jsonUpdate, httpOptions).pipe(
        map((response: Response) => {
          return <ResponseData>response
        }),
        catchError(this.handleError)
      )
    } catch (error) {
      console.log("error", error);
    }
  }

  snqSaveAsDraft(jsonSave: any) {
    try {
      return this.http.post(this.restService.baseUrl + 'snqEnquiry/UpdateSaveAsData', jsonSave, httpOptions).pipe(
        map((response: Response) => {
          return <ResponseData>response
        }),
        catchError(this.handleError)
      )
    } catch (error) {
      console.log("error", error);
    }
  }

  deleteSNQrow(jsonDelete: any) {
    try {
      return this.http.post(this.restService.baseUrl + 'SNQEnquiry/DeleteItem', jsonDelete, httpOptions).pipe(
        map((response: Response) => {
          return <ResponseData>response
        }),
        catchError(this.handleError)
      )
    } catch (error) {
      console.log("error", error);
    }
  }

  deleteMSDrow(jsonDelete: any) {
    try {
      return this.http.post(this.restService.baseUrl + 'MSDEnquiry/DeleteItem', jsonDelete, httpOptions).pipe(
        map((response: Response) => {
          return <ResponseData>response
        }),
        catchError(this.handleError)
      )
    } catch (error) {
      console.log("error", error);
    }
  }

  msdUpdateData(jsonSave: any) {
    try {
      return this.http.post(this.restService.baseUrl + 'MSDEnquiry/UpdateData', jsonSave, httpOptions).pipe(
        map((response: Response) => {
          return <ResponseData>response
        }),
        catchError(this.handleError)
      )
    } catch (error) {
      console.log("error", error);
    }
  }

  msdSaveAsDraft(jsonSave: any) {
    try {
      return this.http.post(this.restService.baseUrl + 'MSDEnquiry/UpdateSaveAsData', jsonSave, httpOptions).pipe(
        map((response: Response) => {
          return <ResponseData>response
        }),
        catchError(this.handleError)
      )
    } catch (error) {
      console.log("error", error);
    }
  }

  getMLProcessType(): Observable<ResponseData> {

    return this.http.post(this.restService.baseUrl + 'MLMaster/GetMLProcessType', httpOptions).pipe(
      map((response: Response) => {
        return <ResponseData>response
      }),
      catchError(this.handleError)
    )
  }

  getCustomerData(): Observable<ResponseData> {
    return this.http.get(this.restService.baseUrl + 'ChangeCustomerSettings/GeCustomerData', httpOptions).pipe(
      map((response: Response) => {
        return <ResponseData>response
      }),
      catchError(this.handleError)
    )
  }

  getMLType(processName : string): Observable<ResponseData> {

    return this.http.post(this.restService.baseUrl + 'MLMaster/GetMLType',{"processType":processName}, httpOptions).pipe(
      map((response: Response) => {
        return <ResponseData>response
      }),
      catchError(this.handleError)
    )
  }

  getMLMasterData(jsonData:any): Observable<ResponseData> {
    return this.http.post(this.restService.baseUrl + 'MLMaster/GetMLMasterData',jsonData, httpOptions).pipe(
      map((response: Response) => {
        return <ResponseData> response
      }),
      catchError(this.handleError)
    )
  }

  getMLMasterIdWiseList(jsonData:any): Observable<ResponseData> {
    return this.http.post(this.restService.baseUrl + 'MLMaster/GetIDwiseMLList',jsonData, httpOptions).pipe(
      map((response: Response) => {
        return <ResponseData> response
      }),
      catchError(this.handleError)
    )
  }

  updateMLData(jsonSave: any) {
    try {
      return this.http.post(this.restService.baseUrl + 'MLMaster/SaveMLMaster', jsonSave, httpOptions).pipe(
        map((response: Response) => {
          return <ResponseData>response
        }),
        catchError(this.handleError)
      )
    } catch (error) {
      console.log("error", error);
    }
  }

  updateNewIMPAData(jsonSave: any) {
    try {
      return this.http.post(this.restService.baseUrl + 'MLMaster/RegisterNewImpa', jsonSave, httpOptions).pipe(
        map((response: Response) => {
          return <ResponseData>response
        }),
        catchError(this.handleError)
      )
    } catch (error) {
      console.log("error", error);
    }
  }

  deleteMLData(jsonDelete: any) {
    try {
      return this.http.post(this.restService.baseUrl + 'MLMaster/DeleteMlMaster', jsonDelete, httpOptions).pipe(
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

  public getStatusCountMSD(req: object): Observable<ResponseData> {
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


  public getStatusCountSNQ(req: object): Observable<ResponseData> {
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
  public snqverifytaskEnquiryList(req: object): Observable<ResponseData> {
    return this.http.post(this.restService.baseUrl + 'snqEnquiry/NotStartedtaskEnquiryList', req, httpOptions).pipe(
      // ...and calling .json() on the response to return data
      map((response: Response) => {
        let responseData = <ResponseData>response;
        return responseData;
        //return response;
      }),
      
      catchError((error: HttpErrorResponse) => {

        return Observable.throw(error);
      })
    );
  }

  public getMLData(req: object): Observable<ResponseData> {
    return this.http.post(this.restService.baseUrl + 'MLMaster/GetMLDataBySearch', req, httpOptions).pipe(
      // ...and calling .json() on the response to return data
      map((response: Response) => {
        let responseData = <ResponseData>response;
        return responseData;
        //return response;
      }),
      
      catchError((error: HttpErrorResponse) => {

        return Observable.throw(error);
      })
    );
  }

  public snqerrortaskEnquiryList(req: object): Observable<ResponseData> {
    return this.http.post(this.restService.baseUrl + 'snqEnquiry/ErrortaskEnquiryList', req, httpOptions).pipe(
      // ...and calling .json() on the response to return data
      map((response: Response) => {
        let responseData = <ResponseData>response;
        return responseData;
        //return response;
      }),
      catchError((error: HttpErrorResponse) => {

        return Observable.throw(error);
      })
    );
  }

  public snqcompletedtaskEnquiryList(req: object): Observable<ResponseData> {
    return this.http.post(this.restService.baseUrl + 'snqEnquiry/CompletedtaskEnquiryList', req, httpOptions).pipe(
      // ...and calling .json() on the response to return data
      map((response: Response) => {
        let responseData = <ResponseData>response;
        return responseData;
        //return response;
      }),
      catchError((error: HttpErrorResponse) => {

        return Observable.throw(error);
      })
    );
  }

  public msdverifytaskEnquiryList(req: object): Observable<ResponseData> {
    return this.http.post(this.restService.baseUrl + 'MSDEnquiry/NotStartedtaskEnquiryList', req, httpOptions).pipe(
      map((response: Response) => {
        let responseData = <ResponseData>response;
        return responseData;
        //return response;
      }),
      catchError((error: HttpErrorResponse) => {

        return Observable.throw(error);
      })
    );
  }

  public msderrortaskEnquiryList(req: object): Observable<ResponseData> {
    return this.http.post(this.restService.baseUrl + 'msdEnquiry/ErrortaskEnquiryList', req, httpOptions).pipe(
      // ...and calling .json() on the response to return data
      map((response: Response) => {
        let responseData = <ResponseData>response;
        return responseData;
        //return response;
      }),
      catchError((error: HttpErrorResponse) => {

        return Observable.throw(error);
      })
    );
  }

  public msdcompletedtaskEnquiryList(req: object): Observable<ResponseData> {
    return this.http.post(this.restService.baseUrl + 'MSDEnquiry/CompletedtaskEnquiryList', req, httpOptions).pipe(
      // ...and calling .json() on the response to return data
      map((response: Response) => {
        let responseData = <ResponseData>response;
        return responseData;
        //return response;
      }),
      catchError((error: HttpErrorResponse) => {

        return Observable.throw(error);
      })
    );
  }

  getOwnerShipAction(PKID: number): Observable<ResponseData> {

    return this.http.get(this.restService.baseUrl + 'SNQEnquiry/Getuserownershipdtl/' + PKID, httpOptions).pipe(
      map((response: Response) => {
        return <ResponseData>response
      }),
      catchError(this.handleError)
    )
  }

  snqUpdateOwnerShip(jsonSave: any) {
    try {
      return this.http.post(this.restService.baseUrl + 'SNQEnquiry/UpdateOwnership', jsonSave, httpOptions).pipe(
        map((response: Response) => {
          return <ResponseData>response
        }),
        catchError(this.handleError)
      )
    } catch (error) {
      console.log("error", error);
    }
  }

  snqReleaseOwnerShip() {
    try {
      return this.http.post(this.restService.baseUrl + 'SNQEnquiry/ReleaseOwnership', {'PK_SNQENQUIRY_HDR_ID': 0,"Ownership":0, 'action': ""}, httpOptions).pipe(
        map((response: Response) => {
          return <ResponseData>response
        }),
        catchError(this.handleError)
      )
    } catch (error) {
      console.log("error", error);
    }
  }

  getMSDOwnerShipAction(PKID: number): Observable<ResponseData> {

    return this.http.get(this.restService.baseUrl + 'MSDEnquiry/Getuserownershipdtl/' + PKID, httpOptions).pipe(
      map((response: Response) => {
        return <ResponseData>response
      }),
      catchError(this.handleError)
    )
  }

  msdUpdateOwnerShip(jsonSave: any) {
    try {
      return this.http.post(this.restService.baseUrl + 'MSDEnquiry/UpdateOwnership', jsonSave, httpOptions).pipe(
        map((response: Response) => {
          return <ResponseData>response
        }),
        catchError(this.handleError)
      )
    } catch (error) {
      console.log("error", error);
    }
  }

  msdReleaseOwnerShip() {
    try {
      return this.http.post(this.restService.baseUrl + 'MSDEnquiry/ReleaseOwnership', {'PK_MSDENQUIRY_HDR_ID': 0,"Ownership":0, 'action': ""}, httpOptions).pipe(
        map((response: Response) => {
          return <ResponseData>response
        }),
        catchError(this.handleError)
      )
    } catch (error) {
      console.log("error", error);
    }
  }

}
