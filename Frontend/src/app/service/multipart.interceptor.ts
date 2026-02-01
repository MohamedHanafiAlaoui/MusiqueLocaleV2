import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MultipartInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('Interceptor called for:', request.url);
    console.log('Request body is FormData:', request.body instanceof FormData);
    
    if (request.body instanceof FormData) {
      console.log('Processing FormData request');
      
      // Clone request without Content-Type header
      request = request.clone({
        headers: request.headers.delete('Content-Type')
      });
      
      console.log('Final headers:', request.headers.keys());
    }
    return next.handle(request);
  }
}
