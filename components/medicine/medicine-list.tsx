import React, { useState, useEffect, useRef } from 'react';
import { Pill, MapPin } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

export interface Medicine {
  id: number;
  CODE: number;
  SPECIALITE: string;
  DOSAGE: string;
  FORME: string;
  PRESENTATION: string;
  SUBSTANCE_ACTIVE: string;
  CLASSE_THERAPEUTIQUE: string;
  PPV: number;
  PH: number;
  STATUT_AMM: string;
  STATUT_COMMERCIALISATION: string;
}

interface MedicineListProps {
  searchQuery?: string;
  onMedicineClick?: (medicine: Medicine) => void;
  onNearbyClick?: (medicine: Medicine) => void;
}

// Helper function to truncate text if it contains more than one word
const truncateClasseTherapeutique = (text: string) => {
  const words = text.split(/[\s-]+/); // Split by spaces or hyphens
  return words.length > 1 ? `${words[0]}...` : text;
};

// Helper function to truncate text if it contains more than two words
const truncateForme = (text: string) => {
  const words = text.split(' ');
  return words.length > 2 ? `${words[0]} ${words[1]}...` : text;
};

const ITEMS_PER_PAGE = 30;

export function MedicineList({
  searchQuery = '',
  onMedicineClick,
  onNearbyClick,
}: MedicineListProps) {
  const [allMedicines, setAllMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const loadingRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Reset when search query changes
    setPage(0);
    setAllMedicines([]);
    setHasMore(true);
  }, [searchQuery]);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8003/medecines/`, {
          params: {
            q: searchQuery,
            skip: page * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE,
          },
        });
        
        const newMedicines = response.data;
        
        setAllMedicines(prev => 
          page === 0 ? newMedicines : [...prev, ...newMedicines]
        );
        
        setHasMore(newMedicines.length === ITEMS_PER_PAGE);
        setError(null);
      } catch (err) {
        setError('Error fetching medicines data. Please try again later.');
        console.error('Error fetching medicines:', err);
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to avoid too many API calls while typing
    const timeoutId = setTimeout(() => {
      fetchMedicines();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [page, searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting && !loading && hasMore) {
          setPage(p => p + 1);
        }
      },
      { threshold: 0.1 }
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
  }, [loading, hasMore]);

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allMedicines.map((medicine) => (
          <div
            key={medicine.id}
            className={cn(
              "bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200",
              onMedicineClick && "cursor-pointer"
            )}
            onClick={() => onMedicineClick?.(medicine)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1 min-w-0 mr-3">
                <h3 className="font-semibold text-gray-900 break-words">{medicine.SPECIALITE}</h3>
                
                <div className="flex items-center text-gray-600">
                  <Pill className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="text-sm">{medicine.DOSAGE}</span>
                </div>
                
                <p className="text-sm text-gray-500">{truncateForme(medicine.FORME)}</p>
                
                <div className="flex items-center justify-between min-w-0">
                  <span className="text-lg font-semibold text-emerald-600 whitespace-nowrap">
                    {medicine.PPV} DH
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full whitespace-nowrap ml-2">
                    {medicine.STATUT_AMM}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0 w-32">
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs block text-center truncate">
                  {truncateClasseTherapeutique(medicine.CLASSE_THERAPEUTIQUE)}
                </span>
              </div>
            </div>

            {onNearbyClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNearbyClick(medicine);
                }}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
              >
                <MapPin className="w-4 h-4 mr-2" />
                À proximité
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      <div 
        ref={loadingRef} 
        className="w-full py-4 text-center text-gray-500"
      >
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : allMedicines.length === 0 ? (
          <div>Aucun médicament trouvé {searchQuery && `pour "${searchQuery}"`}</div>
        ) : !hasMore ? (
          <div>Fin de la liste</div>
        ) : null}
      </div>
    </div>
  );
}
