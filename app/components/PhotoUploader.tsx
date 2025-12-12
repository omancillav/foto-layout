'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface PhotoUploaderProps {
  onPhotoUpload: (file: File) => void;
  currentPhoto: string | null;
}

export default function PhotoUploader({ onPhotoUpload, currentPhoto }: PhotoUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onPhotoUpload(acceptedFiles[0]);
      }
    },
    [onPhotoUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: false,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }
        `}
      >
        <input {...getInputProps()} />
        
        {currentPhoto ? (
          <div className="space-y-4">
            <div className="relative w-48 h-56 mx-auto rounded-lg overflow-hidden shadow-lg bg-gray-100">
              <img
                src={currentPhoto}
                alt="Foto cargada"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Arrastra otra foto aquí o haz clic para cambiarla
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {isDragActive ? '¡Suelta la foto aquí!' : 'Arrastra tu foto aquí'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                o haz clic para seleccionar
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Formatos soportados: JPG, PNG, WEBP
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
