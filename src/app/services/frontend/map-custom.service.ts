import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MapCustomService {

  mapbox = (mapboxgl as typeof mapboxgl);
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 4.632235671307743;
  long = -74.06666639070954;
  zoom = 13;
  coords: any = {};

  constructor() {
    this.mapbox.accessToken = environment.mapboxKey;
  }

  /**
   * Returna promesa para crear mapa con Mapbox.
   * @returns Promise
   */
  buildMap(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.map = new mapboxgl.Map({
          container: 'map',
          style: this.style,
          zoom: this.zoom,
          center: [this.long, this.lat]
        });

        const geocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl,
          marker: false,
          placeholder: 'Buscar ubicación de establecimiento'
        });

        geocoder.on('result', ({ result }) => {
          const marker = new mapboxgl.Marker({ draggable: true, color: 'red' });
          marker.on('dragend', () => {
            this.coords = { geoPoint: marker.getLngLat(), place: '' };
          });
          marker.setLngLat(result.center).addTo(this.map);
          this.coords = { geoPoint: { lng: result.center[0], lat: result.center[1] }, place: result['place_name_es-ES'] };
        });

        return resolve({
          map: this.map,
          geocoder
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Retorna objeto de las coordenas seleccionadas.
   */
  points(): void {
    return this.coords;
  }
}
