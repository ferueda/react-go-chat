import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Chat from './components/Chat';

function App() {
  return (
    <main className="bg-zinc-100 w-full h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h1 className="py-10 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            React-go Chat app
          </h1>
        </div>

        <Routes>
          <Route path="/" element={<Chat />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
