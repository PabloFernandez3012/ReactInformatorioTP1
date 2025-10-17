import { useState, useEffect } from 'react';

function Timer() {
  const [time, setTime] = useState(0);
  const [inputMinutes, setInputMinutes] = useState('');
  const [inputSeconds, setInputSeconds] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning && time > 0) {
      intervalId = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1000) {
            setIsRunning(false);
            setIsFinished(true);
            playSound();
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  const playSound = () => {
    // Usar Web Audio API para crear un sonido
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleStart = () => {
    const minutes = parseInt(inputMinutes) || 0;
    const seconds = parseInt(inputSeconds) || 0;
    const totalTime = (minutes * 60 + seconds) * 1000;
    
    if (totalTime > 0) {
      setTime(totalTime);
      setIsRunning(true);
      setIsFinished(false);
    }
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
    setIsFinished(false);
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setIsFinished(false);
    setInputMinutes('');
    setInputSeconds('');
  };

  const quickSet = (minutes) => {
    setTime(minutes * 60 * 1000);
    setInputMinutes(String(minutes));
    setInputSeconds('0');
    setIsFinished(false);
  };

  return (
    <div className="timer-container">
      {time === 0 && !isRunning ? (
        <div className="timer-setup">
          <h3>Configurar temporizador</h3>
          <div className="time-inputs">
            <div className="input-group">
              <input
                type="number"
                min="0"
                max="59"
                value={inputMinutes}
                onChange={(e) => setInputMinutes(e.target.value)}
                placeholder="00"
                className="time-input"
              />
              <label>minutos</label>
            </div>
            <span className="separator">:</span>
            <div className="input-group">
              <input
                type="number"
                min="0"
                max="59"
                value={inputSeconds}
                onChange={(e) => setInputSeconds(e.target.value)}
                placeholder="00"
                className="time-input"
              />
              <label>segundos</label>
            </div>
          </div>
          
          <div className="quick-buttons">
            <button onClick={() => quickSet(1)}>1 min</button>
            <button onClick={() => quickSet(5)}>5 min</button>
            <button onClick={() => quickSet(10)}>10 min</button>
            <button onClick={() => quickSet(15)}>15 min</button>
            <button onClick={() => quickSet(30)}>30 min</button>
          </div>

          <button className="control-button start" onClick={handleStart}>
            ▶️ Iniciar
          </button>
        </div>
      ) : (
        <>
          <div className={`timer-display ${isFinished ? 'finished' : ''}`}>
            {formatTime(time)}
          </div>
          
          {isFinished && <div className="finished-message">¡Tiempo terminado! ⏰</div>}
          
          <div className="controls">
            <button className="control-button start" onClick={handleStartStop}>
              {isRunning ? '⏸️ Pausar' : '▶️ Reanudar'}
            </button>
            <button className="control-button reset" onClick={handleReset}>
              🔄 Reiniciar
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Timer;
