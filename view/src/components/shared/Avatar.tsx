import React from 'react';

export default function Avatar({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`w-8 overflow-hidden mr-2 ${className ? className : ''}`}>
      <img src={src ? src : '/assets/default-avatar.png'} alt={alt} className="rounded-full" />
    </div>
  );
}
