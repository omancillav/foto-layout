'use client';

import { useState, useRef, useMemo } from 'react';
import PhotoUploader from './components/PhotoUploader';
import LayoutSelector from './components/LayoutSelector';
import PhotoPreview from './components/PhotoPreview';
import ExportButtons from './components/ExportButtons';
import { PaperSize, calculateLayout } from './types';

export default function Home() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedPaperSize, setSelectedPaperSize] = useState<PaperSize>('letter');
  const [photoCount, setPhotoCount] = useState<number>(10);
  const previewRef = useRef<HTMLDivElement>(null);

  // Calcular layout usando useMemo para evitar cálculos innecesarios
  const layout = useMemo(() => {
    return calculateLayout(selectedPaperSize, photoCount);
  }, [selectedPaperSize, photoCount]);

  const handlePhotoUpload = (file: File) => {
    // Revocar URL anterior si existe
    if (photo) {
      URL.revokeObjectURL(photo);
    }
    // Crear nueva URL de preview
    const url = URL.createObjectURL(file);
    setPhoto(url);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Baloo Fotos
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Genera layouts de fotos tamaño infantil 2.5cm × 3cm
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel Izquierdo - Controles */}
          <div className="space-y-6">
            {/* Paso 1: Subir foto */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Sube tu foto
                </h2>
              </div>
              <PhotoUploader onPhotoUpload={handlePhotoUpload} currentPhoto={photo} />
            </section>

            {/* Paso 2: Configurar layout */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </span>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Configura tu layout
                </h2>
              </div>
              <LayoutSelector
                selectedPaperSize={selectedPaperSize}
                onPaperSizeChange={setSelectedPaperSize}
                photoCount={photoCount}
                onPhotoCountChange={setPhotoCount}
              />
            </section>

            {/* Paso 3: Exportar */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </span>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Descarga para imprimir
                </h2>
              </div>
              <ExportButtons layout={layout} photoUrl={photo} />
            </section>
          </div>

          {/* Panel Derecho - Preview */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Vista previa
              </h2>
              <div className="flex items-center justify-center min-h-125 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 overflow-auto max-h-200">
                {layout ? (
                  <PhotoPreview
                    ref={previewRef}
                    layout={layout}
                    photoUrl={photo}
                    scale={0.5}
                  />
                ) : (
                  <div className="text-center text-gray-400 dark:text-gray-500">
                    <svg
                      className="w-16 h-16 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                      />
                    </svg>
                    <p className="text-lg font-medium">Cargando vista previa...</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Baloo Fotos © {new Date().getFullYear()}</p>
          <p className="mt-1">
            Genera layouts de fotos tamaño infantil (2.5cm × 3cm) listos para imprimir
          </p>
        </div>
      </footer>
    </div>
  );
}
