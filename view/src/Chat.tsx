import React from 'react';

import LoginForm from './LoginForm';

export default function Chat() {
  const [input, setInput] = React.useState('');
  const [socket, setSocket] = React.useState<WebSocket | null>(null);
  const [messages, setMessages] = React.useState<string[]>([]);
  const [token, setToken] = React.useState<string | null>(null);
  const [username, setUsername] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!window['WebSocket'] || socket) return;
    if (!token || !username) return;

    const s = new WebSocket(`ws://localhost:8080/room?t=${token}`);
    s.onmessage = (e) => setMessages((prev) => prev.concat(e.data));
    setSocket(s);
  }, [socket, token, username]);

  const submitForm = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === '' || !socket) return;
    socket.send(`${username}: ${input}`);
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
    <div>
      {token && username ? (
        <>
          <h3>
            <span style={{ fontWeight: 'normal', fontSize: '16px' }}>Logged in as </span>
            {username}
          </h3>
          <ul id="messages" style={{ listStyle: 'none', paddingLeft: 0 }}>
            {messages.map((m) => {
              return <li key={m}>{m}</li>;
            })}
          </ul>
          <form id="chatbox" onSubmit={submitForm}>
            <textarea
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
              style={{ display: 'block' }}
            />
            <button type="submit">Send</button>
          </form>
        </>
      ) : (
        <LoginForm onSubmit={login} />
      )}
    </div>
  );
}
