import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { SessionService } from 'src/app/_services/session.service';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(public auth: SessionService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.endsWith("Login/Authenticate")) {
            return next.handle(request);
        }
        if (request.url.endsWith("notify")) {
            return next.handle(request);
        }
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.auth.getToken()}`
            }
        });
        return next.handle(request).pipe(
            catchError(err => {
                if (err instanceof HttpErrorResponse) {

                    if (err.status === 401 || err.status === 403) {

                        this.auth.clearsession();
                        window.location.href = "/login"
                    }

                    // return the error back to the caller
                    return throwError(err);
                }
            }),
            finalize(() => {
                // any cleanup or final activities
            })
        );
        // return next.handle(request).pipe(
        //     map((event: HttpEvent<any>) => {
        //         if (event instanceof HttpResponse) {
        //             console.log('event--->>>', event.status);
        //             console.log('event-asdas-->>>', event);
        //             if (event.status === 401) {
        //                 console.log("401")
        //                 this.auth.clearsession();
        //                 window.location.href = "/login"
        //             }else{
        //                 console.log("Interceptor message")
        //             }
        //         }
        //         return event;
        //     }));
    }
}