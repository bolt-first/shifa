import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Phone } from 'lucide-react';
import { Pharmacy } from '../../lib/types';
import { cn } from '../../lib/utils';
import useSWR from 'swr';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface PharmacyListProps {
  searchQuery?: string;
  onPharmacyClick?: (pharmacy: Pharmacy) => void;
  variant?: 'default' | 'sidebar';
  which?: string;
  pharmacies?: Pharmacy[];
}

const ITEMS_PER_PAGE = 30;

const fetcher = (url: string) => fetch(url).then(res => res.json());

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

const getStatusBadge = (pharmacy: Pharmacy) => {
    if (pharmacy.garde) {
      return <Badge variant="secondary">Garde</Badge>;
    }
  
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour >= 9 && currentHour < 20) {
      return <Badge variant="default">Ouverte</Badge>;
    }
    return <Badge variant="destructive">Fermée</Badge>;
  };

export function PharmacyList({
  searchQuery = '',
  onPharmacyClick,
  variant = 'default',
  which,
  pharmacies: initialPharmacies
}: PharmacyListProps) {
  const [page, setPage] = useState(0);
  const [allPharmacies, setAllPharmacies] = useState<Pharmacy[]>([]);
  const loadingRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: newPharmacies, error } = useSWR<Pharmacy[]>(
    `http://localhost:8003/all-pharmacies/?q=${searchQuery}&skip=${page * ITEMS_PER_PAGE}&limit=${ITEMS_PER_PAGE}&which=${which}`,
    fetcher
  );

  useEffect(() => {
    // Reset when search query changes
    setPage(0);
    setAllPharmacies([]);
  }, [searchQuery]);

  useEffect(() => {
    if (initialPharmacies) {
      setAllPharmacies(initialPharmacies);
      setIsLoading(false);
    } else if (newPharmacies) {
      if (page === 0) {
        setAllPharmacies(newPharmacies);
      } else {
        setAllPharmacies(prev => [...prev, ...newPharmacies]);
      }
      setIsLoading(false);
    }
  }, [newPharmacies, page, initialPharmacies]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting && !isLoading && newPharmacies?.length === ITEMS_PER_PAGE) {
          setIsLoading(true);
          setPage(p => p + 1);
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = loadingRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [newPharmacies, isLoading]);

  const gridCols = variant === 'sidebar'
    ? "grid-cols-1 sm:grid-cols-2"
    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  if (error) return <div className="text-red-500">Failed to load pharmacies</div>;
  if (!allPharmacies && !isLoading && !initialPharmacies) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className={cn("grid gap-4", gridCols)}>
        {allPharmacies.map((pharmacy) => (
          <div
            key={pharmacy.id}
            className={cn(
              "bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200",
              onPharmacyClick && "cursor-pointer"
            )}
            onClick={() => onPharmacyClick?.(pharmacy)}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{pharmacy.name}</h3>
                {getStatusBadge(pharmacy)}
              </div>

              <div className="space-y-2 flex-grow">
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600 line-clamp-2">
                    {pharmacy.streetAddress}, {pharmacy.ville}, {pharmacy.pays}
                  </span>
                </div>

                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{pharmacy.phone}</span>
                </div>
              </div>

              <a
                href={pharmacy.mapAddress}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  const coords = extractCoordinates(pharmacy.mapAddress);
                  if (coords) {
                    // Open Google Maps directions with the coordinates
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`, '_blank');
                  } else {
                    window.open(pharmacy.mapAddress, '_blank');
                  }
                }}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Itinéraire
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      <div
        ref={loadingRef}
        className="w-full py-4 text-center text-gray-500"
      >
        {isLoading ? (
          <div>Loading more pharmacies...</div>
        ) : newPharmacies?.length === 0 ? (
          <div>Aucune pharmacie trouvée {searchQuery && `pour "${searchQuery}"`}</div>
        ) : null}
      </div>
    </div>
  );
}
