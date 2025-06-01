import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
});

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {
  private map!: L.Map;
  private marcadorSelecionado: L.Marker | null = null;


  @Output() coordenadasClicadas = new EventEmitter<{ lat: number, lon: number }>();

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('mapa').setView([38.7169, -9.1399], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;

      console.log('Clique no mapa:', lat, lon);

      // 🔁 Remover o marcador anterior, se existir
      if (this.marcadorSelecionado) {
        this.map.removeLayer(this.marcadorSelecionado);
      }

      // ✅ Criar um novo marcador
      this.marcadorSelecionado = L.marker([lat, lon])
        .addTo(this.map)
        .bindPopup(`Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)}`)
        .openPopup();

      // 📤 Emitir para o componente pai
      this.coordenadasClicadas.emit({ lat, lon });
    });

  }
}
