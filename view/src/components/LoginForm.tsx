import React from 'react';

import Button from './shared/Button';
import FormLabel from './shared/FormLabel';
import TextInput from './shared/TextInput';
interface Props {
  onSubmit: (username: string) => void;
}

export default function LoginForm({ onSubmit }: Props) {
  const [input, setInput] = React.useState('');

  const submitForm = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === '') return;

    onSubmit(input);
  };

  return (
    <form onSubmit={submitForm} className="w-96 mx-auto bg-white rounded-md px-10 py-10">
      <div className="flex flex-col">
        <FormLabel htmlFor="username">Username</FormLabel>
        <TextInput
          name="username"
          value={input}
          placeholder="Enter your username"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
        />

        <Button type="submit" className="mt-3">
          Enter room
        </Button>
      </div>
    </form>
  );
}
