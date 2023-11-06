// src/App.tsx
import React from 'react';
import './css/App.css';
import ChessGame from './components/ChessGame';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Tonys Chess Game</h1>
        <ChessGame />
      </header>
    </div>
  );
};

export default App;
