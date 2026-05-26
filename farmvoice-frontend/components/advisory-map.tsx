'use client';

import { MapContainer, CircleMarker, TileLayer, Popup } from 'react-leaflet';

export default function AdvisoryMap({ advisories }: { advisories: Array<{ title: string; country?: string | null }> }) {
  return (
    <div className="h-[28rem] overflow-hidden rounded-[1.5rem]">
      <MapContainer center={[7.5, 2]} zoom={2} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {advisories.map((advisory, index) => (
          <CircleMarker key={`${advisory.title}-${index}`} center={[7.5 + index, 2 + index]} radius={20} pathOptions={{ color: '#E07B39', fillColor: '#2D6A4F', fillOpacity: 0.3 }}>
            <Popup>{advisory.title}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}