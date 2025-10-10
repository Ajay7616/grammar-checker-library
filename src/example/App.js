import React from 'react';
import GrammarRectifier from './components/GrammarRectifier';
import './App.css';

function App() {
  return (
    <div>
      <GrammarRectifier>
        <textarea placeholder="Type something with mistakes..." />
      </GrammarRectifier>

      <GrammarRectifier>
        <input type="text" placeholder="Try typing 'teh' or 'definately'" />
      </GrammarRectifier>
    </div>
  );
}

export default App;