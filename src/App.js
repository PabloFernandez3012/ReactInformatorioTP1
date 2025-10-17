import { useState, useEffect } from 'react';
import Clock from './components/Clock';
import Stopwatch from './components/Stopwatch';
import Timer from './components/Timer';

function App() {
  const [activeTab, setActiveTab] = useState('clock');

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Reloj Mundial</h1>
        <nav className="nav">
          <button 
            className={`nav-button ${activeTab === 'clock' ? 'active' : ''}`}
            onClick={() => setActiveTab('clock')}
          >
            Reloj
          </button>
          <button 
            className={`nav-button ${activeTab === 'stopwatch' ? 'active' : ''}`}
            onClick={() => setActiveTab('stopwatch')}
          >
            Cronómetro
          </button>
          <button 
            className={`nav-button ${activeTab === 'timer' ? 'active' : ''}`}
            onClick={() => setActiveTab('timer')}
          >
            Temporizador
          </button>
        </nav>
      </header>

      <main className="main-content">
        {activeTab === 'clock' && <Clock />}
        {activeTab === 'stopwatch' && <Stopwatch />}
        {activeTab === 'timer' && <Timer />}
      </main>
    </div>
  );
}

export default App;
