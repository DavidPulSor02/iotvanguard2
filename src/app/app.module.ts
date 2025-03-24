import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Importación de HttpClientModule para llamadas HTTP
import { HttpClientModule } from '@angular/common/http';

// Importación del servicio ArduinoService (opcional, pero recomendable)
import { ArduinoService } from './services/arduino.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule, // ✅ Asegúrate de que esto esté aquí
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ArduinoService, // ✅ Opcional: Agregar ArduinoService como provider
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
