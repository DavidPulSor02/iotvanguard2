import { Component } from '@angular/core';
import { ArduinoService } from '../services/arduino.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  puertaAbierta = false;  // Estado inicial de la puerta

  constructor(private arduinoService: ArduinoService) { }

  togglePuerta() {
    this.puertaAbierta = !this.puertaAbierta;
    this.arduinoService.togglePuerta(this.puertaAbierta).subscribe(() => {
      console.log(`Puerta ${this.puertaAbierta ? 'abierta' : 'cerrada'}`);
    });
  }
}
