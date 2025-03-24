import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArduinoService {
  private arduinoIP = 'http://192.168.1.100'; 

  constructor(private http: HttpClient) { }

  getStatus(): Observable<any> {
    return this.http.get(`${this.arduinoIP}/status`);
  }
  getHistory(): Observable<any> {
    return this.http.get(`${this.arduinoIP}/history`);
  }
  togglePuerta(estado: boolean): Observable<any> {
    return this.http.get(`${this.arduinoIP}/toggleDoor?state=${estado ? 'open' : 'close'}`);
  }

}
