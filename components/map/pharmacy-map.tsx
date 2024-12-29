'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});

interface PharmacyMapProps {
  center: [number, number];
  name: string;
  zoom?: number;
}

export default function PharmacyMap({ center, name, zoom = 13 }: PharmacyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!mapRef.current) return;

    // Create a custom icon for the pharmacy marker
    const pharmacyIcon = new L.Icon({
      iconUrl: '/images/pharmacy-marker.png',
      iconRetinaUrl: '/images/pharmacy-marker.png',
      shadowUrl: '/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
      shadowAnchor: [12, 41]
    });

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    } else {
      mapInstanceRef.current.setView(center, zoom);
    }

    const marker = L.marker(center, { icon: pharmacyIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup(name)
      .openPopup();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, name, zoom]);

  return (
    <div 
      ref={mapRef} 
      className="h-[200px] w-full rounded-lg overflow-hidden border border-gray-200" 
    />
  );
}
