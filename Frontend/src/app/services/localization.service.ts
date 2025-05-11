import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Coordenadas {
  lat: number;
  lon: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  constructor(private http: HttpClient) {}

  getCoordenadasDaMorada(morada: {
    rua: string;
    numero_porta: number;
    codigo_postal: string;
    localidade: string;
  }): Observable<Coordenadas | null> {
    const query = `${morada.rua} ${morada.numero_porta}, ${morada.codigo_postal} ${morada.localidade}`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

    return this.http.get<any[]>(url).pipe(
      map(result => {
        if (result.length === 0) return null;
        return {
          lat: parseFloat(result[0].lat),
          lon: parseFloat(result[0].lon)
        };
      })
    );
  }


  getLocalizacaoAtual(): Promise<Coordenadas> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocalização não suportada');
      } else {
        navigator.geolocation.getCurrentPosition(
          position => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            });
          },
          err => reject(err.message)
        );
      }
    });
  }


  calcularDistanciaKm(
    lat1: number, lon1: number,
    lat2: number, lon2: number
  ): number {
    const R = 6371; // raio da Terra em km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  calcularTempoEstimado(distanciaKm: number): number {
    const minutosPorKm = 4;
    return Math.round(distanciaKm * minutosPorKm);
  }
}
