'use client';

import { useState, useEffect } from 'react';

interface AvatarProps {
  src?: string | null;
  name: string;
  className?: string; // For sizing (e.g., "h-12 w-12") or extra styles
  textClassName?: string; // For text sizing (e.g., "text-lg")
}

export default function Avatar({
  src,
  name,
  className = 'h-10 w-10',
  textClassName = 'text-sm',
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Reset error state if src changes (e.g. reused component)
  useEffect(() => {
    setImageError(false);
  }, [src]);

  const showImage = src && !imageError;

  return (
    <div
      className={`${className} relative flex shrink-0 overflow-hidden rounded-full`}>
      {showImage ? (
        <img
          src={src as string}
          alt={name}
          onError={() => setImageError(true)}
          className='aspect-square h-full w-full object-cover'
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center rounded-full bg-primary text-white font-bold ${textClassName}`}>
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
