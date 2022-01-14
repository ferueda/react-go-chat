import React from 'react';

import LoginForm from './LoginForm';
import TextAreaInput from './shared/TextAreaInput';
import Button from './shared/Button';

export default function Chat() {
  const [input, setInput] = React.useState('');
  const [socket, setSocket] = React.useState<WebSocket | null>(null);
  const [messages, setMessages] = React.useState<
    { username: string; message: string; when: string; avatar?: string }[]
  >([]);
  const [token, setToken] = React.useState<string | null>(null);
  const [username, setUsername] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!window['WebSocket'] || socket) return;
    if (!token || !username) return;

    const s = new WebSocket(`ws://localhost:8080/room?t=${token}`);
    s.onmessage = (e) => setMessages((prev) => prev.concat(JSON.parse(e.data)));
    setSocket(s);
  }, [socket, token, username]);

  const submitForm = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === '' || !socket) return;
    socket.send(JSON.stringify({ message: input }));
    setInput('');
  };

  const login = async (username: string) => {
    const res = await fetch('http://localhost:8080/token', {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });

    if (res.status !== 200) return;
    const { token } = await res.json();

    setUsername(username);
    setToken(token);
  };

  return (
    <div className="mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
      {token && username ? (
        <div className="w-96 relative mx-auto bg-white rounded-md px-10 py-4">
          <h3 className="absolute top-2 font-bold">
            <span className="font-light">Logged in as </span>
            {username}
          </h3>
          <div id="messages" className="h-80 bg-gray-100 mb-4 mt-6 p-2 rounded-md overflow-auto">
            {messages.map((m, i, a) => {
              return (
                <div key={m.when + ' - ' + m.username} className="my-1">
                  {m.username !== username && i > 0 && a[i - 1].username !== m.username && (
                    <div className="font-bold">{m.username}</div>
                  )}
                  <div className={`overflow-x-auto ${m.username === username && 'text-right'}`}>
                    {m.message}
                  </div>
                </div>
              );
            })}
          </div>
          <form id="chatbox" className="flex flex-col" onSubmit={submitForm}>
            <TextAreaInput
              name="message"
              value={input}
              placeholder="Type a message"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            />
            <Button type="submit" className="mt-3">
              Send
            </Button>
          </form>
        </div>
      ) : (
        <LoginForm onSubmit={login} />
      )}
    </div>
  );
}
