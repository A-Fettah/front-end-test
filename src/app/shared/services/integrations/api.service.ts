import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = environment.baseUrl;

    /**
     * GET request template
    */
    get<T>(endpoint: string, options?: {
        headers?: HttpHeaders | Record<string, string | string[]>;
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | Record<string, string | number | boolean | readonly (string | number | boolean)[]>;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    }): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}/${endpoint}`, options);
    }

    /**
     * POST request template
    */
    post<T, D>(endpoint: string, data: D | null, options?: {
        headers?: HttpHeaders | Record<string, string | string[]>;
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | Record<string, string | number | boolean | readonly (string | number | boolean)[]>;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    }): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, options);
    }
}