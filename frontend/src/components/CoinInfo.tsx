import { useEffect, useState } from 'react';
import classes from './CoinInfo.module.css';
import { FC } from 'react';

type Props = {
  isLoggedIn: boolean;
  timerRunning: boolean;
  gameId: string | undefined;
  setMessage: (setMessage: string) => void;
  message: string;
};

const CoinInfo: FC<Props> = ({ isLoggedIn, timerRunning, gameId, setMessage, message }) => {
  const [coins, setCoins] = useState<string | undefined>(undefined);

  useEffect(() => {
    const checkCoins = async () => {
      if (!isLoggedIn) {
        setCoins(undefined);
        return;
      }
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/current', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCoins(data.coins);
    };
    checkCoins();
  }, [message, isLoggedIn]);

  const getHint = async () => {
    try {
      setMessage('Asking bot...');
      const response = await fetch(`/api/games/${gameId}/hint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (data?.status) {
        setMessage(data.status);
      } else {
        setMessage('Something went wrong!');
      }
    } catch {
      setMessage('Error connecting to the server or game is not found');
    }
  };

  return isLoggedIn && timerRunning ? (
    <>
      <span className="coins">You have: {coins} coins</span>
      <div className={classes.button}>
        <button name="checkbox" type="button" onClick={getHint}></button>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </>
  ) : null;
};

export default CoinInfo;
