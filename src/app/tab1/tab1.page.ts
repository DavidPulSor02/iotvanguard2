import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { environment } from "../../environments/environment";
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  sensorValue: number = 0;
  puertaEstado: string = "Cerrado"; // Estado inicial de la puerta

  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    const db = getDatabase(app);

    // Referencia al sensor en Firebase
    const sensorRef = ref(db, '/sensor/valor');
    onValue(sensorRef, (snapshot: any) => {
      this.sensorValue = snapshot.val();
      console.log("Sensor actualizado:", this.sensorValue);
    });

    // Referencia al estado de la puerta
    const puertaRef = ref(db, '/puerta/estado');
    onValue(puertaRef, (snapshot: any) => {
      this.puertaEstado = snapshot.val();
      console.log("Estado de la puerta:", this.puertaEstado);
    });
  }

  // Método para cambiar el estado de la puerta desde la app
  togglePuerta() {
    const db = getDatabase();
    const nuevoEstado = this.puertaEstado === "Abierto" ? "Cerrado" : "Abierto";

    set(ref(db, '/puerta/estado'), nuevoEstado)
      .then(() => {
        console.log("Estado de la puerta actualizado:", nuevoEstado);
      })
      .catch((error: any) => {
        console.error("Error actualizando puerta:", error);
      });
  }
}     