import React from 'react';
import { X, Pill, AlertCircle, Check, Ban } from 'lucide-react';
import { Medicine } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MedicineDetailsProps {
  medicine: Medicine;
  isOpen: boolean;
  onClose: () => void;
}

export function MedicineDetails({ medicine, isOpen, onClose }: MedicineDetailsProps) {
  return (
    <div
      className={cn(
        "fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="h-full overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold text-gray-900">{medicine.SPECIALITE}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Pill className="w-5 h-5 mr-2 text-emerald-600" />
                <span className="text-gray-900">{medicine.DOSAGE}</span>
              </div>
              <span className="text-lg font-semibold text-emerald-600">
                {medicine.PPV} DH
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Forme:</span> {medicine.FORME}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Présentation:</span> {medicine.PRESENTATION}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Classe thérapeutique:</span> {medicine.CLASSE_THERAPEUTIQUE}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Distributeur ou fabriquant:</span> {medicine.EPI}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Prix hospitalier:</span> {medicine.PH} DH
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Prix de Facturation Hors Taxes:</span> {medicine.PFHT} DH
              </p>
            </div>
          </div>

          {/* Status Information */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 py-2 px-3 rounded-lg bg-gray-50">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-gray-900">
                {medicine.STATUT_AMM}
              </span>
            </div>
            <div className="flex items-center space-x-2 py-2 px-3 rounded-lg bg-gray-50">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-900">
                {medicine.STATUT_COMMERCIALISATION}
              </span>
            </div>
          </div>

          {/* Substance Active */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Substance active</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {medicine.SUBSTANCE_ACTIVE}
              </p>
            </div>
          </div>

          {/* Alternatives - Only show if alternatives exist */}
          {medicine.alternatives && medicine.alternatives.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Alternatives disponibles
              </h3>
              <div className="space-y-2">
                {medicine.alternatives.map((alternative, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 py-2 px-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-900">{alternative}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
