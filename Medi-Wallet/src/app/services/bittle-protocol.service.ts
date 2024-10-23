import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BittleProtocolService {
  private apiUrl = 'https://api.clinica.com/transfer'; // Reemplazar por tu URL API real

  constructor(private http: HttpClient) {}

  // Método para transferir el historial médico en fragmentos
  transferPatientDataInBittles(patientId: string, fragmentNumber: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Este endpoint recibirá un número de fragmento para enviar la información dividida
    return this.http.post(
      `${this.apiUrl}/send-fragment`,
      {
        patientId,
        fragmentNumber,
      },
      { headers }
    );
  }

  // Método para confirmar la recepción de un fragmento
  confirmBittleReception(fragmentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm-fragment`, { fragmentId });
  }

  // Método para recuperar los fragmentos necesarios de un paciente
  getNecessaryFragments(patientId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/fragments/${patientId}`);
  }

  // Método para obtener datos críticos del paciente
  getCriticalData(patientId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/critical-data/${patientId}`);
  }
}
