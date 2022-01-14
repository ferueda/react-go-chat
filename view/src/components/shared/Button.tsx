export default function Button({
  type = 'button',
  children,
  className,
}: {
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactChild;
  className?: string;
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 ${
        className ? className : ''
      }`}
    >
      {children}
    </button>
  );
}
