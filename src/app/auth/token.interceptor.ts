import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs/Observable";
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (
      request.url &&
      request.url == "https://new.compaksa.co.za/wp-json/jwt-auth/v1/token"
    ) {
      return next.handle(request);
    }
    const authReq = request.clone({
      setHeaders: {
        Authorization: `Bearer ` + this.auth.getToken(),
      },
    });
    return next.handle(authReq);
  }
}
