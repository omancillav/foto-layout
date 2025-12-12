// Tipos para la aplicación de fotos infantiles

export type PaperSize = 'letter' | '4x6';

export interface PaperDimensions {
  width: number;  // en pulgadas
  height: number; // en pulgadas
  widthCm: number; // en centímetros
  heightCm: number; // en centímetros
  name: string;
}

export interface PhotoLayout {
  paperSize: PaperSize;
  totalPhotosRequested: number;
  sheets: SheetLayout[];
}

export interface SheetLayout {
  sheetNumber: number;
  rows: number;
  cols: number;
  photosInSheet: number;
  marginX: number; // margen horizontal en pulgadas
  marginY: number; // margen vertical en pulgadas
}

// Exportar constantes para usar en otros componentes
export const MIN_PAPER_MARGIN = 0.15; // margen del borde del papel
export const PHOTO_SPACING = 0.08; // espacio entre fotos (~2mm)

// Tamaño fijo de fotos infantiles: 2.5cm x 3cm
export const PHOTO_SIZE_CM = {
  width: 2.5,  // cm
  height: 3.0, // cm
};

// Convertir a pulgadas (1 pulgada = 2.54 cm)
export const PHOTO_SIZE_INCHES = {
  width: PHOTO_SIZE_CM.width / 2.54,   // ~0.984 pulgadas
  height: PHOTO_SIZE_CM.height / 2.54, // ~1.181 pulgadas
};

// Dimensiones de papel en pulgadas
export const PAPER_SIZES: Record<PaperSize, PaperDimensions> = {
  letter: { 
    width: 8.5, 
    height: 11, 
    widthCm: 21.59,
    heightCm: 27.94,
    name: 'Carta (8.5" x 11")' 
  },
  '4x6': { 
    width: 4, 
    height: 6, 
    widthCm: 10.16,
    heightCm: 15.24,
    name: '4" x 6"' 
  },
};

// DPI para impresión de alta calidad
export const PRINT_DPI = 300;

/**
 * Calcula cuántas fotos caben en una hoja y cómo distribuirlas
 */
export function calculateLayout(
  paperSize: PaperSize,
  totalPhotos: number
): PhotoLayout {
  const paper = PAPER_SIZES[paperSize];
  const photoW = PHOTO_SIZE_INCHES.width;
  const photoH = PHOTO_SIZE_INCHES.height;

  // Calcular cuántas fotos caben en horizontal y vertical (incluyendo espaciado)
  const availableWidth = paper.width - (MIN_PAPER_MARGIN * 2);
  const availableHeight = paper.height - (MIN_PAPER_MARGIN * 2);
  
  const maxCols = Math.floor((availableWidth + PHOTO_SPACING) / (photoW + PHOTO_SPACING));
  const maxRows = Math.floor((availableHeight + PHOTO_SPACING) / (photoH + PHOTO_SPACING));
  const photosPerSheet = maxCols * maxRows;

  // Calcular cuántas hojas necesitamos
  const totalSheets = Math.ceil(totalPhotos / photosPerSheet);

  const sheets: SheetLayout[] = [];
  let remainingPhotos = totalPhotos;

  for (let i = 0; i < totalSheets; i++) {
    const photosInThisSheet = Math.min(remainingPhotos, photosPerSheet);
    
    // Calcular distribución óptima para esta hoja
    let bestRows = 1;
    let bestCols = photosInThisSheet;
    
    // Buscar la distribución más cuadrada posible
    for (let rows = 1; rows <= maxRows; rows++) {
      const cols = Math.ceil(photosInThisSheet / rows);
      if (cols <= maxCols) {
        if (Math.abs(rows - cols) < Math.abs(bestRows - bestCols)) {
          bestRows = rows;
          bestCols = cols;
        }
      }
    }

    // Las fotos empiezan desde arriba a la izquierda con margen mínimo
    sheets.push({
      sheetNumber: i + 1,
      rows: bestRows,
      cols: bestCols,
      photosInSheet: photosInThisSheet,
      marginX: MIN_PAPER_MARGIN,
      marginY: MIN_PAPER_MARGIN,
    });

    remainingPhotos -= photosInThisSheet;
  }

  return {
    paperSize,
    totalPhotosRequested: totalPhotos,
    sheets,
  };
}
