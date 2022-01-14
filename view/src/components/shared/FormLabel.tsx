import React from 'react';

export default function FormLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactChild;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 my-1">
      {children}
    </label>
  );
}
