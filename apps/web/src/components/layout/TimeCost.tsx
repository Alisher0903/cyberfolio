import React, { useState, useEffect } from 'react';

export default function LiveClock(): React.JSX.Element {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateClock = (): void => {
      const now = new Date();
      const hours: string = String(now.getHours()).padStart(2, '0');
      const minutes: string = String(now.getMinutes()).padStart(2, '0');
      const seconds: string = String(now.getSeconds()).padStart(2, '0');

      setTime(`${hours}:${minutes}:${seconds}`);
    };

    updateClock();

    const timerId = setInterval(updateClock, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ backgroundColor: '#00FF87' }}
        aria-hidden="true"
      />
      <span className="font-mono text-xs" style={{ color: '#7FA8C4' }}>
        {time || '00:00:00'}
      </span>
    </div>
  );
}
