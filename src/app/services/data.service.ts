import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TreeNodeResponse } from "../models/common.model";

@Injectable({
  providedIn: 'root',
})
export class DataService {
  dataUrl = 'http://localhost:4200/assets/nodetree-mockup.json';

  constructor(private http: HttpClient) { }

  loadData(): Observable<TreeNodeResponse> {
    return this.http.get(this.dataUrl) as Observable<TreeNodeResponse>;
  }
}