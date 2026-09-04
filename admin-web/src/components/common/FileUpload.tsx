import React, { useCallback, useState } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: Accept;
  maxSize?: number;
  label?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, accept, maxSize, label = 'Arrastra y suelta un archivo aquí, o haz clic para seleccionar' }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false
  });

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    onFileSelect(null);
  };

  return (
    <div 
      {...getRootProps()} 
      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer transition-colors
        ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400 bg-white'}
      `}
    >
      <input {...getInputProps()} />
      <div className="space-y-1 text-center">
        {selectedFile ? (
          <div className="flex flex-col items-center">
            <FileIcon className="mx-auto h-12 w-12 text-primary-500" />
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-sm text-gray-900 font-medium">{selectedFile.name}</span>
              <button type="button" onClick={clearFile} className="p-1 rounded-full hover:bg-gray-200">
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <>
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600 justify-center mt-4">
              <span className="relative rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                {label}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">XLSX, XLS hasta 10MB</p>
          </>
        )}
      </div>
    </div>
  );
};
