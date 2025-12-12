'use client';

import { forwardRef } from 'react';
import { PhotoLayout, PAPER_SIZES, PRINT_DPI, PHOTO_SIZE_INCHES, PHOTO_SPACING } from '../types';

interface PhotoPreviewProps {
  layout: PhotoLayout;
  photoUrl: string | null;
  scale?: number;
  sheetIndex?: number; // Para mostrar una hoja específica o todas
}

const PhotoPreview = forwardRef<HTMLDivElement, PhotoPreviewProps>(
  ({ layout, photoUrl, scale = 1, sheetIndex }, ref) => {
    const paper = PAPER_SIZES[layout.paperSize];
    
    // Determinar qué hojas mostrar
    const sheetsToShow = sheetIndex !== undefined 
      ? [layout.sheets[sheetIndex]] 
      : layout.sheets;

    // Calcular dimensiones en píxeles para preview (usando 96 DPI para pantalla)
    const screenDPI = 96;
    const previewWidth = paper.width * screenDPI * scale;
    const previewHeight = paper.height * screenDPI * scale;
    
    // Calcular dimensiones de cada foto en el preview
    const photoWidthPx = PHOTO_SIZE_INCHES.width * screenDPI * scale;
    const photoHeightPx = PHOTO_SIZE_INCHES.height * screenDPI * scale;
    const spacingPx = PHOTO_SPACING * screenDPI * scale;

    return (
      <div className="flex flex-col items-center space-y-6" ref={ref}>
        {sheetsToShow.map((sheet) => (
          <div key={sheet.sheetNumber} className="flex flex-col items-center">
            {layout.sheets.length > 1 && (
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Hoja {sheet.sheetNumber} de {layout.sheets.length}
              </p>
            )}
            <div
              className="bg-white shadow-xl rounded-lg overflow-hidden"
              style={{
                width: previewWidth,
                height: previewHeight,
              }}
            >
              <div
                className="relative w-full h-full"
                style={{
                  padding: `${sheet.marginY * screenDPI * scale}px ${sheet.marginX * screenDPI * scale}px`,
                }}
              >
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `repeat(${sheet.cols}, ${photoWidthPx}px)`,
                    gridTemplateRows: `repeat(${sheet.rows}, ${photoHeightPx}px)`,
                    gap: `${spacingPx}px`,
                  }}
                >
                  {Array.from({ length: sheet.photosInSheet }).map((_, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden bg-gray-100 border border-gray-300"
                      style={{
                        width: photoWidthPx,
                        height: photoHeightPx,
                      }}
                    >
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
          Vista previa - {paper.name} ({layout.sheets.length} {layout.sheets.length === 1 ? 'hoja' : 'hojas'})
        </p>
      </div>
    );
  }
);

PhotoPreview.displayName = 'PhotoPreview';

export default PhotoPreview;

