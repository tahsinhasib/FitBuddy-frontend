'use client';

import { useEffect, useState } from 'react';

export default function Clock() {
    const [time, setTime] = useState<string>(() => formatTime(new Date()));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(formatTime(new Date()));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    function formatTime(date: Date): string {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });
    }

    return (
        <div className="mt-4 text-center text-lg font-semibold text-gray-800">
            Current Time: {time}
        </div>
    );
}
