import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { TreeNodeResponse } from "../models/common.model";

@Injectable({
  providedIn: 'root',
})
export class DataService {
  loadData(): Observable<TreeNodeResponse> {
    const data = {
      "name": "guitars",
      "children": [
        {
          "name": "acoustic",
          "children": [
            {
              "name": "Kremona"
            },
            {
              "name": "Epiphone"
            },
            {
              "name": "Gibson"
            },
            {
              "name": "Yamaha"
            }
          ]
        },
        {
          "name": "electric",
          "children": [
            {
              "name": "Fender",
              "children": [
                {
                  "name": "Telecaster"
                },
                {
                  "name": "Stratocaster"
                },
                {
                  "name": "Jaguar"
                }
              ]
            },
            {
              "name": "Gibson",
              "children": [
                {
                  "name": "Les Paul"
                },
                {
                  "name": "SG"
                },
                {
                  "name": "ES-335"
                },
                {
                  "name": "ES-339"
                }
              ]
            }
          ]
        },
        {
          "name": "acoustic bass"
        },
        {
          "name": "electric bass"
        }
      ]
    };

    return of(data);
  }
}