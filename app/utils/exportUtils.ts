import { jsPDF } from 'jspdf';
import { PhotoLayout, PAPER_SIZES, PRINT_DPI, PHOTO_SIZE_INCHES, PHOTO_SPACING } from '../types';

export type ExportFormat = 'pdf' | 'png' | 'jpg';

interface ExportOptions {
  layout: PhotoLayout;
  photoUrl: string;
  format: ExportFormat;
  quality?: number;
}

/**
 * Genera un canvas con una hoja de fotos para impresión
 */
async function generateSheetCanvas(
  layout: PhotoLayout,
  sheetIndex: number,
  photoUrl: string
): Promise<HTMLCanvasElement> {
  const paper = PAPER_SIZES[layout.paperSize];
  const sheet = layout.sheets[sheetIndex];
  
  // Crear canvas con dimensiones de impresión (300 DPI)
  const canvasWidth = paper.width * PRINT_DPI;
  const canvasHeight = paper.height * PRINT_DPI;
  
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo crear el contexto del canvas');
  
  // Fondo blanco
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Cargar la imagen
  const img = await loadImage(photoUrl);
  
  // Calcular dimensiones de cada foto en píxeles (a 300 DPI)
  const photoWidthPx = PHOTO_SIZE_INCHES.width * PRINT_DPI;
  const photoHeightPx = PHOTO_SIZE_INCHES.height * PRINT_DPI;
  const spacingPx = PHOTO_SPACING * PRINT_DPI;
  
  // Calcular posición inicial (con márgenes)
  const startX = sheet.marginX * PRINT_DPI;
  const startY = sheet.marginY * PRINT_DPI;
  
  // Dibujar cada foto
  let photoCount = 0;
  for (let row = 0; row < sheet.rows && photoCount < sheet.photosInSheet; row++) {
    for (let col = 0; col < sheet.cols && photoCount < sheet.photosInSheet; col++) {
      const x = startX + col * (photoWidthPx + spacingPx);
      const y = startY + row * (photoHeightPx + spacingPx);
      
      // Dibujar foto con object-fit: cover
      drawImageCover(ctx, img, x, y, photoWidthPx, photoHeightPx);
      
      // Dibujar borde sutil alrededor de cada foto
      ctx.strokeStyle = '#d0d0d0';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x, y, photoWidthPx, photoHeightPx);
      
      photoCount++;
    }
  }
  
  return canvas;
}

/**
 * Carga una imagen desde URL
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Dibuja una imagen con comportamiento similar a object-fit: cover
 */
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const imgRatio = img.width / img.height;
  const targetRatio = width / height;
  
  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = img.width;
  let sourceHeight = img.height;
  
  if (imgRatio > targetRatio) {
    // La imagen es más ancha, recortar los lados
    sourceWidth = img.height * targetRatio;
    sourceX = (img.width - sourceWidth) / 2;
  } else {
    // La imagen es más alta, recortar arriba y abajo
    sourceHeight = img.width / targetRatio;
    sourceY = (img.height - sourceHeight) / 2;
  }
  
  ctx.drawImage(
    img,
    sourceX, sourceY, sourceWidth, sourceHeight,
    x, y, width, height
  );
}

/**
 * Exporta el layout de fotos al formato especificado
 */
export async function exportLayout(options: ExportOptions): Promise<void> {
  const { layout, photoUrl, format, quality = 0.95 } = options;
  const paper = PAPER_SIZES[layout.paperSize];
  
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `fotos-infantiles-${layout.totalPhotosRequested}-${paper.widthCm.toFixed(0)}x${paper.heightCm.toFixed(0)}cm-${timestamp}`;
  
  if (format === 'pdf') {
    // Crear PDF con múltiples páginas si es necesario
    const pdf = new jsPDF({
      orientation: paper.width > paper.height ? 'landscape' : 'portrait',
      unit: 'in',
      format: [paper.width, paper.height],
    });
    
    // Generar cada hoja
    for (let i = 0; i < layout.sheets.length; i++) {
      const canvas = await generateSheetCanvas(layout, i, photoUrl);
      const imgData = canvas.toDataURL('image/jpeg', quality);
      
      if (i > 0) {
        pdf.addPage();
      }
      
      pdf.addImage(imgData, 'JPEG', 0, 0, paper.width, paper.height);
    }
    
    // Descargar PDF
    pdf.save(`${filename}.pdf`);
  } else {
    // Para PNG/JPG, generar cada hoja como archivo separado
    for (let i = 0; i < layout.sheets.length; i++) {
      const canvas = await generateSheetCanvas(layout, i, photoUrl);
      const link = document.createElement('a');
      
      const sheetSuffix = layout.sheets.length > 1 ? `-hoja${i + 1}` : '';
      link.download = `${filename}${sheetSuffix}.${format}`;
      
      if (format === 'png') {
        link.href = canvas.toDataURL('image/png');
      } else {
        link.href = canvas.toDataURL('image/jpeg', quality);
      }
      
      link.click();
      
      // Pequeño delay entre descargas si hay múltiples hojas
      if (i < layout.sheets.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }
}

