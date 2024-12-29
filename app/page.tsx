'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BottomNav } from '@/components/navigation/bottom-nav';
import { MapPin, Pill, Moon, ArrowRight, Search, Shield } from 'lucide-react';

const FeatureCard = ({ icon, title, description, link }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  link: string 
}) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:border-emerald-200 transition-all duration-300"
  >
    <Link href={link} className="block p-6 group">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-emerald-50 p-3 rounded-xl">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
          {title}
        </h2>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex items-center text-emerald-600 font-semibold group-hover:text-emerald-700">
        Explorer <ArrowRight className="ml-2 w-5 h-5" />
      </div>
    </Link>
  </motion.div>
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white pb-16">
      <main className="max-w-5xl mx-auto px-4 pt-16 pb-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Shifa Maroc 🩺
            <span className="block text-2xl md:text-3xl text-emerald-600 font-medium mt-2">
              Votre assistant santé intelligent
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-8">
            Trouvez instantanément des médicaments, localisez des pharmacies, et accédez à des informations de santé essentielles.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/pharmacies" className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors flex items-center">
              <Search className="mr-2" /> Trouver une Pharmacie
            </Link>
            <Link href="/medicaments" className="bg-white border border-emerald-600 text-emerald-600 px-6 py-3 rounded-xl hover:bg-emerald-50 transition-colors flex items-center">
              <Pill className="mr-2" /> Rechercher Médicaments
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <FeatureCard 
            icon={<MapPin className="w-7 h-7 text-emerald-600" />}
            title="Pharmacies Proches"
            description="Localisez instantanément les pharmacies autour de vous avec notre carte interactive et précise."
            link="/pharmacies"
          />
          <FeatureCard 
            icon={<Moon className="w-7 h-7 text-emerald-600" />}
            title="Pharmacies de Garde"
            description="Trouvez les pharmacies ouvertes en dehors des heures habituelles, y compris la nuit et les week-ends."
            link="/garde"
          />
          <FeatureCard 
            icon={<Pill className="w-7 h-7 text-emerald-600" />}
            title="Médicaments"
            description="Consultez la disponibilité et les détails des médicaments dans différentes pharmacies."
            link="/medicaments"
          />
        </motion.div>

        {/* Additional Services */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Services Supplémentaires
              </h2>
              <p className="text-gray-600 max-w-xl">
                Shifa Maroc offre des fonctionnalités avancées pour simplifier votre parcours de santé.
              </p>
            </div>
            <Shield className="w-16 h-16 text-emerald-500 opacity-20" />
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-emerald-50 p-4 rounded-xl">
              <h3 className="font-semibold text-emerald-800 mb-2">Conseils Santé</h3>
              <p className="text-sm text-gray-600">Accédez à des informations médicales fiables et à jour.</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl">
              <h3 className="font-semibold text-emerald-800 mb-2">Urgences</h3>
              <p className="text-sm text-gray-600">Numéros et contacts importants en cas d'urgence.</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl">
              <h3 className="font-semibold text-emerald-800 mb-2">Notifications</h3>
              <p className="text-sm text-gray-600">Restez informé des dernières mises à jour et alertes.</p>
            </div>
          </div>
        </motion.div>

        {/* Footer Message */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-xl font-semibold text-emerald-600">
            Shifa Maroc : Votre santé, notre priorité ! 💚
          </p>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}