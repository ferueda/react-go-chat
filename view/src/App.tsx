import React from 'react';

function App() {
  const [input, setInput] = React.useState('');
  const [socket, setSocket] = React.useState<WebSocket | null>(null);
  const [messages, setMessages] = React.useState<string[]>([]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const submitForm = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === '' || !socket) return;
    console.log('caca');
    setInput('');
    socket.send(input);
  };

  React.useEffect(() => {
    if (!window['WebSocket'] || socket) return;
    const s = new WebSocket('ws://localhost:8080/room');
    s.onmessage = (e) => setMessages((prev) => prev.concat(e.data));
    setSocket(s);
  }, [socket]);

  return (
    <div className="App">
      <h1>React-go Chat app</h1>
      <ul id="messages" style={{ listStyle: 'none', paddingLeft: 0 }}>
        {messages.map((m) => {
          return <li key={m}>{m}</li>;
        })}
      </ul>
      <form id="chatbox" onSubmit={submitForm}>
        <textarea onChange={onChange} style={{ display: 'block' }} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
