import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTags(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tags`);
  }
  getTagsByType(tagTypeId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tags/type/${tagTypeId}`);
  }
}
