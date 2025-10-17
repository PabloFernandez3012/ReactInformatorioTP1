import { useState, useEffect } from 'react';

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps([...laps, time]);
    }
  };

  return (
    <div className="stopwatch-container">
      <div className="stopwatch-display">{formatTime(time)}</div>
      
      <div className="controls">
        <button className="control-button start" onClick={handleStartStop}>
          {isRunning ? '⏸️ Pausar' : '▶️ Iniciar'}
        </button>
        <button className="control-button lap" onClick={handleLap} disabled={!isRunning}>
          🏁 Vuelta
        </button>
        <button className="control-button reset" onClick={handleReset}>
          🔄 Reiniciar
        </button>
      </div>

      {laps.length > 0 && (
        <div className="laps-container">
          <h3>Vueltas:</h3>
          <div className="laps-list">
            {laps.map((lap, index) => (
              <div key={index} className="lap-item">
                <span className="lap-number">Vuelta {laps.length - index}</span>
                <span className="lap-time">{formatTime(lap)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Stopwatch;
