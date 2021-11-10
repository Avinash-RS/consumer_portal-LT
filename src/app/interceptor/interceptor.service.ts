import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoadingService } from '../services/loading.service';
import { CommonService } from "src/app/services/common.service";
@Injectable()
export class InterceptorService implements HttpInterceptor {


  constructor(
    private _loading: LoadingService,
    private commonservice: CommonService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // this._loading.setLoading(true, request.url);
    // return next.handle(request)
    //   .pipe(catchError((err) => {
    //     this._loading.setLoading(false, request.url);
    //     return err;
    //   }))
    //   .pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
    //     if (evt instanceof HttpResponse) {
    //       this._loading.setLoading(false, request.url);
    //     }
    //     return evt;
    //   }));


    const clone = request.clone({
      headers: request.headers.set('Accept', 'application/json'),
    });
    this._loading.setLoading(true, request.url);
    return next.handle(clone).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
                this._loading.setLoading(false, request.url);
        }
        return event;
      }),
      retry(1),
      // return next.handle(request).pipe(
      //   map((event: HttpEvent<any>) => {
      //     if (!request.headers.has('Content-Type')) {
      //       // request = request.clone({ headers: request.headers.set('Content-Type', 'multipart/form-data') });
      //       request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
      //     }

      //     if (event instanceof HttpResponse) {
      //       // this.appConfig.hideLoader();
      //       return event;
      //     }
      //     // this.appConfig.hideLoader();
      //     return event;
      //   }),
      //   retry(3),
      catchError((error: HttpErrorResponse) => {
        this._loading.setLoading(false, request.url);
          if (error && error['status'] !== 200) {
          // console.log(error ? error : '');
        }

        if (error.status === 0) {
          return throwError(error);
        }
        
        if (error.status === 400) {
          return throwError(error);
        }

        if (error.status === 401) {
          this.commonservice.logout('unauthorized');
          return throwError(error);
        }

        if (error.status === 403) {
            return throwError(error);
        }

        if (error.status === 422) {
          return throwError(error);
        }

        if (error.status === 500) {
          return throwError(error);
        }

        if (error.status === 404) {
          return throwError(error);
        }

        if (error.status === 409) {
          return throwError(error);
        }

        if (error.status === 200) {
        } else {
          return throwError(error);
        }
        return throwError(error);
      })
    );
  }
}
