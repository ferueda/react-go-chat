import React from 'react';

interface Props {
  onSubmit: (username: string) => void;
}

export default function LoginForm({ onSubmit }: Props) {
  const [input, setInput] = React.useState('');

  const submitForm = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    e.preventDefault();
    if (input === '') return;

    onSubmit(input);
  };

  return (
    <form onSubmit={submitForm}>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '200px' }}>
        <label htmlFor="username">Enter your username</label>
        <input
          id="username"
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
        />
        <button type="submit">Enter room</button>
      </div>
    </form>
  );
}
