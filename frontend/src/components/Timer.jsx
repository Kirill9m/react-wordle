import { useState, useEffect } from "react";

const Timer = ({ gameData, timerRunning }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!gameData || !gameData.gameStarted || !timerRunning) return;

    const startTime = new Date(gameData.gameStarted);
    const intervalId = setInterval(() => {
      const elapsedTime = Math.round((new Date() - startTime) / 1000);
      setTime(elapsedTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [gameData, timerRunning]);

  return <p className="game__time">Time: {time} seconds</p>;
};

export default Timer;