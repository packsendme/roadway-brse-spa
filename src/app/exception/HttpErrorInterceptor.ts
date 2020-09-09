import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
 } from '@angular/common/http';
 import { Observable, throwError } from 'rxjs';
 import { retry, catchError } from 'rxjs/operators';

export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          errorMessage = this.getServerErrorMessage(error);
          //window.alert(errorMessage);
          return throwError(errorMessage);
        })
      )
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
        case 404: {
            return `Not Found`;
        }
        case 403: {
            return `Access Denied`;
        }
        case 500: {
            return `Internal Server Error`;
        }
        case 302: {
          return `Sorry, Data cannot be registered, it is already registered in the database`;
      }
        default: {
            return `Unknown Server Error`;
        }

    }
}


 }
