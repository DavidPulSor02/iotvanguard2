import { Component, OnInit } from '@angular/core';
import { ArduinoService } from '../services/arduino.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  activityLog: { rfid: string; status: string; time: string }[] = [];

  constructor(private arduinoService: ArduinoService) { }

  ngOnInit() {
    this.loadActivityLog();
  }

  loadActivityLog() {
    this.arduinoService.getHistory().subscribe((data) => {
      this.activityLog = data;
    });
  }
}
