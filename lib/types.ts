export interface Medicine {
  id: string;
  name: string;
  form: string;
  dosage: string;
  price: string;
  laboratory: string;
  description: string;
  category: string;
  prescription: boolean;
  alternatives: string[];
  indications: string;
  contraindications?: string;
}

export interface Pharmacy {
  id: number;
  name: string;
  streetAddress: string;
  mapAddress: string;
  ville: string;
  pays: string;
  phone: string;
  url: string;
  status: 'Ouverte' | 'Fermée' | 'Garde';
  latitude?: number;
  longitude?: number;
  garde: boolean;
}
