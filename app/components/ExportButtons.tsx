'use client';

import { useState } from 'react';
import { ExportFormat, exportLayout } from '../utils/exportUtils';
import { PhotoLayout } from '../types';

interface ExportButtonsProps {
  layout: PhotoLayout | null;
  photoUrl: string | null;
}

export default function ExportButtons({ layout, photoUrl }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    if (!layout || !photoUrl) return;

    setIsExporting(true);
    setExportingFormat(format);

    try {
      await exportLayout({
        layout,
        photoUrl,
        format,
        quality: 0.95,
      });
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Hubo un error al exportar. Por favor intenta de nuevo.');
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  const isDisabled = !layout || !photoUrl || isExporting;

  const buttons: { format: ExportFormat; label: string; icon: React.ReactElement }[] = [
    {
      format: 'pdf',
      label: 'Descargar PDF',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      format: 'jpg',
      label: 'Descargar JPG',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      format: 'png',
      label: 'Descargar PNG',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full space-y-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Exportar para impresión
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {buttons.map(({ format, label, icon }) => (
          <button
            key={format}
            onClick={() => handleExport(format)}
            disabled={isDisabled}
            className={`
              flex items-center justify-center gap-2 px-4 py-3 rounded-lg
              font-medium transition-all
              ${isDisabled
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                : format === 'pdf'
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }
            `}
          >
            {isExporting && exportingFormat === format ? (
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              icon
            )}
            <span>{isExporting && exportingFormat === format ? 'Generando...' : label}</span>
          </button>
        ))}
      </div>

      {isDisabled && !isExporting && (
        <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
          {!photoUrl
            ? 'Sube una foto para poder exportar'
            : 'Cargando...'}
        </p>
      )}

      {layout && layout.sheets.length > 1 && (
        <p className="text-xs text-blue-600 dark:text-blue-400 text-center">
          PDF: {layout.sheets.length} páginas • JPG/PNG: {layout.sheets.length} archivos
        </p>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Los archivos se generan a 300 DPI para impresión de alta calidad
      </p>
    </div>
  );
}

