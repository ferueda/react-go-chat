import React from 'react';

export default function TextInput({
  name,
  placeholder,
  value,
  className,
  onChange,
}: {
  name: string;
  value: string;
  placeholder?: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative rounded-md shadow-sm">
      <input
        name={name}
        id={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`border focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-2 sm:text-md border-gray-300 rounded-md ${
          className ? className : ''
        }`}
      />
    </div>
  );
}
