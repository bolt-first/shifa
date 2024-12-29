import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { X, MapPin, Phone, Clock } from 'lucide-react';
import { Pharmacy } from '@/lib/types';
import { cn } from '@/lib/utils';
import 'leaflet/dist/leaflet.css';

// Create a client-side only Map component
const Map = dynamic(() => import('@/components/map/pharmacy-map'), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Loading map...</span>
    </div>
  ),
});

const extractCoordinates = (mapAddress: string): { lat: number; lng: number } | null => {
  try {
    const url = new URL(mapAddress);
    const coordinates = url.searchParams.get('q');
    if (coordinates) {
      const [lat, lng] = coordinates.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
  } catch (error) {
    console.error('Error extracting coordinates:', error);
  }
  return null;
};

interface PharmacyDetailsProps {
  pharmacy: Pharmacy;
  isOpen: boolean;
  onClose: () => void;
}

export function PharmacyDetails({ pharmacy, isOpen, onClose }: PharmacyDetailsProps) {
  const coordinates = pharmacy ? extractCoordinates(pharmacy.mapAddress) : null;

  return (
    <div
      className={cn(
        "fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="h-full overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold text-gray-900">{pharmacy.name}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Map */}
          {coordinates && (
            <Map
              center={[coordinates.lat, coordinates.lng]}
              name={pharmacy.name}
              zoom={16}
            />
          )}

          {/* Status and Info */}
          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center space-x-2">
              <div className={cn(
                'w-3 h-3 rounded-full',
                pharmacy.status === 'Ouverte' ? 'bg-green-500' : 
                pharmacy.status === 'Garde' ? 'bg-yellow-500' : 'bg-red-500'
              )} />
              <span className={cn(
                'font-medium',
                pharmacy.status === 'Ouverte' ? 'text-green-600' : 
                pharmacy.status === 'Garde' ? 'text-yellow-600' : 'text-red-600'
              )}>
                {pharmacy.status}
              </span>
            </div>

            {/* Address */}
            <div>
              <h3 className="font-medium mb-1" style={{ color: 'black' }}>Adresse</h3>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-gray-600">
                  <div>{pharmacy.streetAddress}</div>
                  <div>{pharmacy.ville}{pharmacy.pays && `, ${pharmacy.pays}`}</div>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div>
              <h3 className="font-medium mb-1" style={{ color: 'black' }}>Téléphone</h3>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                <a 
                  href={`tel:${pharmacy.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {pharmacy.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Directions Button */}
          <a
            href={pharmacy.mapAddress}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-4 py-2 bg-emerald-600 text-white text-center rounded-lg hover:bg-emerald-700 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              const coords = extractCoordinates(pharmacy.mapAddress);
              if (coords) {
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`, '_blank');
              } else {
                window.open(pharmacy.mapAddress, '_blank');
              }
            }}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            Obtenir l'itinéraire
          </a>
        </div>
      </div>
    </div>
  );
}
