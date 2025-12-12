'use client';

import { PaperSize, PAPER_SIZES, PHOTO_SIZE_CM } from '../types';
import { useState } from 'react';

interface LayoutSelectorProps {
  selectedPaperSize: PaperSize;
  onPaperSizeChange: (size: PaperSize) => void;
  photoCount: number;
  onPhotoCountChange: (count: number) => void;
}

export default function LayoutSelector({
  selectedPaperSize,
  onPaperSizeChange,
  photoCount,
  onPhotoCountChange,
}: LayoutSelectorProps) {
  const [inputValue, setInputValue] = useState(photoCount.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    const num = parseInt(value);
    if (!isNaN(num) && num > 0 && num <= 1000) {
      onPhotoCountChange(num);
    }
  };

  const incrementCount = () => {
    const newCount = photoCount + 1;
    if (newCount <= 1000) {
      setInputValue(newCount.toString());
      onPhotoCountChange(newCount);
    }
  };

  const decrementCount = () => {
    const newCount = photoCount - 1;
    if (newCount >= 1) {
      setInputValue(newCount.toString());
      onPhotoCountChange(newCount);
    }
  };

  // Calcular cuántas fotos caben por hoja
  const paper = PAPER_SIZES[selectedPaperSize];
  const photoWInches = PHOTO_SIZE_CM.width / 2.54;
  const photoHInches = PHOTO_SIZE_CM.height / 2.54;
  const spacing = 0.08; // espacio entre fotos
  const margin = 0.15; // margen del papel
  
  const availableWidth = paper.width - (margin * 2);
  const availableHeight = paper.height - (margin * 2);
  
  const maxCols = Math.floor((availableWidth + spacing) / (photoWInches + spacing));
  const maxRows = Math.floor((availableHeight + spacing) / (photoHInches + spacing));
  const photosPerSheet = maxCols * maxRows;
  const sheetsNeeded = Math.ceil(photoCount / photosPerSheet);

  return (
    <div className="w-full space-y-6">
      {/* Selector de tamaño de papel */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Tamaño de papel
        </label>
        <div className="flex gap-3">
          {(Object.keys(PAPER_SIZES) as PaperSize[]).map((size) => (
            <button
              key={size}
              onClick={() => onPaperSizeChange(size)}
              className={`
                flex-1 px-4 py-3 rounded-lg border-2 transition-all
                ${selectedPaperSize === size
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }
              `}
            >
              <span className="block font-medium">{PAPER_SIZES[size].name}</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                Hasta {photosPerSheet} fotos/hoja
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Contador de fotos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Cantidad de fotos (tamaño infantil: {PHOTO_SIZE_CM.width}cm × {PHOTO_SIZE_CM.height}cm)
        </label>
        
        <div className="flex items-center gap-4">
          {/* Botón decrementar */}
          <button
            onClick={decrementCount}
            disabled={photoCount <= 1}
            className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl"
          >
            −
          </button>

          {/* Input numérico */}
          <input
            type="number"
            min="1"
            max="1000"
            value={inputValue}
            onChange={handleInputChange}
            className="flex-1 px-4 py-3 text-center text-2xl font-bold rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-blue-500 focus:outline-none"
          />

          {/* Botón incrementar */}
          <button
            onClick={incrementCount}
            disabled={photoCount >= 1000}
            className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl"
          >
            +
          </button>
        </div>

        {/* Botones rápidos */}
        <div className="grid grid-cols-5 gap-2 mt-3">
          {[5, 10, 20, 50, 100].map((count) => (
            <button
              key={count}
              onClick={() => {
                setInputValue(count.toString());
                onPhotoCountChange(count);
              }}
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* Info de hojas necesarias */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-medium text-blue-900 dark:text-blue-100">
            Resumen
          </h3>
        </div>
        <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
          <p>📄 Hojas necesarias: <strong>{sheetsNeeded}</strong></p>
          <p>🖼️ Fotos por hoja: <strong>hasta {photosPerSheet}</strong> ({maxCols} × {maxRows})</p>
          <p>📐 Tamaño de cada foto: <strong>{PHOTO_SIZE_CM.width}cm × {PHOTO_SIZE_CM.height}cm</strong></p>
          <p>📊 Total de fotos: <strong>{photoCount}</strong></p>
        </div>
      </div>
    </div>
  );
}

