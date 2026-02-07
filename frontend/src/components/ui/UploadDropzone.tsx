// components/ui/UploadDropzone.tsx
"use client";

import React, { useRef } from "react";
import { Upload } from "lucide-react";

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  previewUrl?: string;
  accept?: string;
  className?: string;
}

export default function UploadDropzone({
  onFileSelect,
  previewUrl,
  accept = "image/*",
  className = "",
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-center
        border-2 border-dashed border-[#D0D5DD] rounded-xl
        bg-gray-50 hover:bg-gray-100
        cursor-pointer transition-colors
        min-h-[200px]
        ${className}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="absolute inset-0 p-2">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 p-6">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <Upload className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              <span className="text-purple-600 font-semibold">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">
              SVG, PNG, JPG or GIF (max. 800x400px)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
