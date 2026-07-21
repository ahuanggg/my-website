import React, { useEffect, useState } from 'react';

const format = (d) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

const Clock = () => {
    const [time, setTime] = useState(() => format(new Date()));
    useEffect(() => {
        const interval = setInterval(() => setTime(format(new Date())), 1000);
        return () => clearInterval(interval);
    }, []);
    return <span className='tray-clock'>{time}</span>;
};

export default Clock;
