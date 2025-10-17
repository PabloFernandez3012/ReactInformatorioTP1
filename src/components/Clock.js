import { useState, useEffect } from 'react';

// Lista extendida de zonas horarias populares
const popularTimezones = [
  { name: 'Local', timezone: null },
  { name: 'Nueva York', timezone: 'America/New_York' },
  { name: 'Londres', timezone: 'Europe/London' },
  { name: 'Tokio', timezone: 'Asia/Tokyo' },
  { name: 'Sydney', timezone: 'Australia/Sydney' },
  { name: 'París', timezone: 'Europe/Paris' },
  { name: 'Dubai', timezone: 'Asia/Dubai' },
  { name: 'Los Ángeles', timezone: 'America/Los_Angeles' },
  { name: 'México', timezone: 'America/Mexico_City' },
  { name: 'Madrid', timezone: 'Europe/Madrid' },
  { name: 'Berlín', timezone: 'Europe/Berlin' },
  { name: 'Moscú', timezone: 'Europe/Moscow' },
  { name: 'Pekín', timezone: 'Asia/Shanghai' },
  { name: 'Mumbai', timezone: 'Asia/Kolkata' },
  { name: 'São Paulo', timezone: 'America/Sao_Paulo' },
  { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires' },
  { name: 'Toronto', timezone: 'America/Toronto' },
  { name: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
  { name: 'Singapur', timezone: 'Asia/Singapore' },
  { name: 'Estambul', timezone: 'Europe/Istanbul' },
  { name: 'Lima', timezone: 'America/Lima' },
  { name: 'Bogotá', timezone: 'America/Bogota' },
  { name: 'Santiago', timezone: 'America/Santiago' },
  { name: 'Caracas', timezone: 'America/Caracas' },
  { name: 'Roma', timezone: 'Europe/Rome' },
  { name: 'Atenas', timezone: 'Europe/Athens' },
  { name: 'El Cairo', timezone: 'Africa/Cairo' },
  { name: 'Bangkok', timezone: 'Asia/Bangkok' },
  { name: 'Seúl', timezone: 'Asia/Seoul' },
  { name: 'Auckland', timezone: 'Pacific/Auckland' },
];

function Clock() {
  const [times, setTimes] = useState({});
  const [dates, setDates] = useState({});
  const [selectedZones, setSelectedZones] = useState([
    { name: 'Local', timezone: null },
    { name: 'Nueva York', timezone: 'America/New_York' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [timeDifference, setTimeDifference] = useState('');

  const getTimezoneOffset = (timezone) => {
    const date = new Date();
    if (timezone === null) {
      return -date.getTimezoneOffset() / 60;
    }
    
    // Obtener el offset de la zona horaria
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'longOffset'
    });
    
    const parts = formatter.formatToParts(date);
    const offsetPart = parts.find(part => part.type === 'timeZoneName');
    
    if (offsetPart && offsetPart.value.includes('GMT')) {
      const offset = offsetPart.value.replace('GMT', '');
      if (offset === '') return 0;
      
      const sign = offset[0] === '+' ? 1 : -1;
      const hours = parseInt(offset.slice(1, 3)) || 0;
      const minutes = parseInt(offset.slice(4, 6)) || 0;
      
      return sign * (hours + minutes / 60);
    }
    
    return 0;
  };

  const calculateTimeDifference = () => {
    if (selectedZones.length === 2) {
      const offset1 = getTimezoneOffset(selectedZones[0].timezone);
      const offset2 = getTimezoneOffset(selectedZones[1].timezone);
      const diff = Math.abs(offset1 - offset2);
      
      const hours = Math.floor(diff);
      const minutes = Math.round((diff - hours) * 60);
      
      if (minutes === 0) {
        setTimeDifference(`Diferencia: ${hours} ${hours === 1 ? 'hora' : 'horas'}`);
      } else {
        setTimeDifference(`Diferencia: ${hours}h ${minutes}min`);
      }
    } else {
      setTimeDifference('');
    }
  };

  useEffect(() => {
    const updateTimes = () => {
      const newTimes = {};
      const newDates = {};
      
      selectedZones.forEach(zone => {
        try {
          const now = new Date();
          
          if (zone.timezone === null) {
            newTimes[zone.name] = now.toLocaleTimeString('es-ES');
            newDates[zone.name] = now.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          } else {
            newTimes[zone.name] = now.toLocaleTimeString('es-ES', {
              timeZone: zone.timezone,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });
            newDates[zone.name] = now.toLocaleDateString('es-ES', {
              timeZone: zone.timezone,
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
        } catch (e) {
          newTimes[zone.name] = 'Error';
          newDates[zone.name] = 'Error';
        }
      });
      
      setTimes(newTimes);
      setDates(newDates);
    };

    updateTimes();
    calculateTimeDifference();
    const intervalId = setInterval(updateTimes, 1000);
    return () => clearInterval(intervalId);
  }, [selectedZones]);

  const addZone = (zone) => {
    if (selectedZones.length >= 2) {
      // Si ya hay 2 zonas, reemplazar la segunda
      setSelectedZones([selectedZones[0], zone]);
    } else {
      const exists = selectedZones.some(z => z.timezone === zone.timezone && z.name === zone.name);
      if (!exists) {
        setSelectedZones([...selectedZones, zone]);
      }
    }
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const removeZone = (index) => {
    if (selectedZones.length > 1) {
      setSelectedZones(selectedZones.filter((_, i) => i !== index));
    }
  };

  const filteredTimezones = popularTimezones.filter(zone =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (zone.timezone && zone.timezone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="clock-container">
      <div className="timezone-selector">
        <h3>Buscar y Comparar Zonas Horarias</h3>
        
        {/* Buscador de zonas */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar ciudad (ej: Madrid, Tokio, París, Lima...)"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="search-input"
          />
          {showSuggestions && searchTerm && filteredTimezones.length > 0 && (
            <div className="suggestions-dropdown">
              {filteredTimezones.map((zone, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => addZone(zone)}
                >
                  <span className="suggestion-name">{zone.name}</span>
                  <span className="suggestion-timezone">{zone.timezone || 'Local'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="help-text">
          {selectedZones.length < 2 
            ? `Selecciona ${2 - selectedZones.length} zona${selectedZones.length === 1 ? '' : 's'} más para comparar`
            : 'Comparando 2 zonas horarias (máximo alcanzado)'}
        </div>
      </div>

      {timeDifference && (
        <div className="time-difference">
          {timeDifference}
        </div>
      )}

      <div className="clocks-grid">
        {selectedZones.map((zone, index) => (
          <div key={index} className="clock-card">
            {selectedZones.length > 1 && (
              <button 
                className="remove-button"
                onClick={() => removeZone(index)}
                title="Eliminar"
              >
                ✕
              </button>
            )}
            <div className="zone-name">{zone.name}</div>
            <div className="zone-timezone">{zone.timezone || 'Hora Local'}</div>
            <div className="clock-date">{dates[zone.name] || 'Cargando...'}</div>
            <div className="clock-display">{times[zone.name] || '00:00:00'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Clock;
