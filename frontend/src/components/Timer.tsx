import { useState, useEffect, FC } from 'react';

type GameData = {
  gameId?: string;
  lang?: string;
  length: number;
  playerId: string;
  unique: boolean;
  status?: string;
  gameStarted?: string;
};

type Props = {
  gameData: GameData | undefined;
  timerRunning: boolean;
};

const Timer: FC<Props> = ({ gameData, timerRunning }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!gameData || !gameData.gameStarted || !timerRunning) return;

    const startTime = new Date(gameData.gameStarted);
    const intervalId = setInterval(() => {
      const elapsedTime = Math.round((new Date().getTime() - startTime.getTime()) / 1000);
      setTime(elapsedTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [gameData, timerRunning]);

  return <p className="game__time">Time: {time} seconds</p>;
};

export default Timer;
