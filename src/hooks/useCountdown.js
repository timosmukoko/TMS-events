import { useEffect, useState } from 'react';

const useCountdown = (targetDateTime) => {
  const calculateTimeLeft = () => {
    const now = Date.now();
    const eventTime = new Date(targetDateTime).getTime();
    const diff = eventTime - now;

    if (diff <= 0) {
      return { status: 'Started', isUrgent: false };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    const isUrgent = diff < 24 * 60 * 60 * 1000;

    return {
      status: `${days}d ${hours}h ${minutes}m ${seconds}s`,
      isUrgent,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000); // update every second

    return () => clearInterval(interval);
  }, [targetDateTime]);

  return timeLeft;
};

export default useCountdown;
