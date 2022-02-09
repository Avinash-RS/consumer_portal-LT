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
import { AppConfigService } from '../utils/app-config.service';
@Injectable()
export class InterceptorService implements HttpInterceptor {


  constructor(
    private _loading: LoadingService,
    private commonservice: CommonService,
    private appConfig: AppConfigService
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

    let userDetails: any = JSON.parse(this.appConfig.getSessionStorage('userDetails'));
    if(userDetails){
      var id = userDetails.userId;
      var token = 'Bearer ' + this.appConfig.getSessionStorage('token');
    } else {
      id = 'RNpS7aki0COQm6WEg9WE8VWiopu9rF5oQank2AdWyM3UKr62WUu9l1R1BfaO9';
      token = 'Bearer aqSkKT6qguVyANMPtR6qqWaiCLUTRNpS7aki0COQm6WEg9WE8VWiopu9rF5oQank2AdWyM3UKr62WUu9l1R1BfaO9CzM16Vi89ecAX6ADPfhGBzpAEXze1do0SqtMkdQ5oGqFqtXphoc4DZL4hb6wRdg09RWzEJcnYJLtvska9HfvQiywtu1LZvDt1AD104ypzLaIRV6dGtKWHrhYgxVn7D3Q9mkTS3oejbVX8z81RwN3Ely6g59t5RRU88BVJiv'
    }
    const clone = request.clone({
              headers: new HttpHeaders({
              'Accept': 'application/json',
              'requestId': id,
              'Authorization':token
            })
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
