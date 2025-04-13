import { useEffect, useState } from "react";
import classes from './CoinInfo.module.css'

const CoinInfo = ({ isLoggedIn, timerRunning }) => {
  const [coins, setCoins] = useState(null);


  useEffect(() => {
    const checkCoins = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch("/api/users/current", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      setCoins(data.coins);
    };
    checkCoins();
  }, []);

  const getHint = async () => {
    try {
      setMessage('Asking bot...')
      const response = await fetch(`/api/games/${gameData.gameId}/hint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guess: input, highscore: isChecked }),
      });
      const data = await response.json();
      setGuessResponse(data);

      if (data?.status) {
        setMessage(data.status);
      } else {
        setMessage('Something went wrong!')
      }

      setInput('');
    } catch {
      setMessage('Error connecting to the server or game is not found')
    }
  };

  return (
    (isLoggedIn && timerRunning ) ? (
      <div className={classes.button}>
        <button name="checkbox" type="button"></button>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    ) : null
  );
}

export default CoinInfo;