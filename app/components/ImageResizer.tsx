'use client';

import { useState, useRef, useEffect } from 'react';

interface ImageResizerProps {
  targetWidth: number;
  targetHeight: number;
}

export default function ImageResizer({ targetWidth: initialWidth, targetHeight: initialHeight }: ImageResizerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [borderColor, setBorderColor] = useState('#000000');
  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (selectedImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.src = selectedImage;
      img.onload = () => {
        // Calculate scaling to fit while maintaining aspect ratio
        const scale = Math.min(
          dimensions.width / img.width,
          dimensions.height / img.height
        );
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        // Calculate positioning to center the image
        const x = (dimensions.width - scaledWidth) / 2;
        const y = (dimensions.height - scaledHeight) / 2;

        // Update canvas size
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        // Draw background (border)
        ctx.fillStyle = borderColor;
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);

        // Draw image
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      };
    }
  }, [selectedImage, borderColor, dimensions.width, dimensions.height]);

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-gray-900 rounded-lg shadow-xl">
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100
            cursor-pointer"
        />
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Border Color
        </label>
        <div className="flex gap-4 items-center">
          <input
            type="color"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
            className="h-10 w-20 cursor-pointer rounded"
          />
          <span className="text-gray-300">{borderColor}</span>
        </div>
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Output Size
        </label>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">Width (px)</label>
            <input
              type="number"
              value={dimensions.width}
              onChange={(e) => setDimensions(prev => ({ ...prev, width: Math.max(1, parseInt(e.target.value) || 1) }))}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">Height (px)</label>
            <input
              type="number"
              value={dimensions.height}
              onChange={(e) => setDimensions(prev => ({ ...prev, height: Math.max(1, parseInt(e.target.value) || 1) }))}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            />
          </div>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="border border-gray-700 rounded-lg max-w-full h-auto"
        />
        {!selectedImage && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            Upload an image to preview
          </div>
        )}
      </div>

      {selectedImage && (
        <button
          onClick={() => {
            const link = document.createElement('a');
            link.download = 'resized-image.png';
            link.href = canvasRef.current?.toDataURL() || '';
            link.click();
          }}
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          Download Image
        </button>
      )}
    </div>
  );
}