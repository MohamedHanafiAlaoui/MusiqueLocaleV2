import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  handleError(error: HttpErrorResponse) {
    let message = 'Unknown error occurred';

    if (error.error) {
      message = error.error.message || error.error;
    } else if (error.status) {
      message = 'Cannot connect to server';
    } else {
      message = `Error: ${error.status}:${error.statusText}`;
    }

    console.error('Error occurred:', message);
    return throwError(() => message);
  }
}
