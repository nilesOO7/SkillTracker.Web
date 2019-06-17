import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';

import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Configuration } from '../app.constants';

import { LoaderService } from '../services/loader.service';

@Injectable()
export class DataService {

  private actionUrl: string;

  constructor(
    private http: HttpClient,
    private _configuration: Configuration,
    private _loaderService: LoaderService) {

    this.actionUrl = _configuration.ServerWithApiUrl;
    this.showLoader();
  }

  public getAll<T>(actionName: string): Observable<T> {

    let serviceURL = this.actionUrl + actionName;

    return this.http.get<T>(serviceURL)
      .finally(() => {
        this.hideLoader();
      });
  }

  public getSingle<T>(actionName: string): Observable<T> {

    let serviceURL = this.actionUrl + actionName;

    return this.http.get<T>(serviceURL)
      .finally(() => {
        this.hideLoader();
      });
  }

  public getSingleById<T>(actionName: string, id: number): Observable<T> {

    let serviceURL = this.actionUrl + actionName + "/";

    return this.http.get<T>(serviceURL + id)
      .finally(() => {
        this.hideLoader();
      });
  }

  public add<T>(actionName: string, item: T): Observable<T> {
    let serviceURL = this.actionUrl + actionName;

    let toAdd = JSON.stringify(item);

    return this.http.post<T>(serviceURL, toAdd)
      .finally(() => {
        this.hideLoader();
      });
  }

  public update<T>(actionName: string, item: T): Observable<T> {

    let serviceURL = this.actionUrl + actionName;
    let toUopdate = JSON.stringify(item);

    return this.http.put<T>(serviceURL, toUopdate)
      .finally(() => {
        this.hideLoader();
      });
  }

  public delete<T>(actionName: string, id: number): Observable<T> {

    let serviceURL = this.actionUrl + actionName + "/";

    return this.http.delete<T>(serviceURL + id)
      .finally(() => {
        this.hideLoader();
      });
  }

  public upload(fileToUpload: any) {

    let serviceURL = this.actionUrl + "upload/";
    let input = new FormData();
    input.append("file", fileToUpload);

    return this.http.post(serviceURL, input)
      .finally(() => {
        this.hideLoader();
      });
  }

  private showLoader(): void {
    this._loaderService.show();
  }

  private hideLoader(): void {
    this._loaderService.hide();
  }
}
