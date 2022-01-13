import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import Chat from './Chat';

function App() {
  return (
    <div className="App">
      <h1>React-go Chat app</h1>

      <Routes>
        <Route path="/" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
