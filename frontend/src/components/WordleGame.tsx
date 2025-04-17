import { useState, useEffect } from 'react';
import GameStart from './GameStart';
import GamePlay from './GamePlay';
import GameResults from './GameResults';
import Timer from './Timer';
import Login from './Login';
import Register from './Register';
import CoinInfo from './CoinInfo';
import { GameData } from '../types';
import { UserStatement } from '../types';

type Result = {
  letter: string;
  result: 'correct' | 'incorrect' | 'misplaced';
};

type GuessResponse = {
  result: Result[] | boolean;
  guess: string;
  timeStarted: string;
  score: number;
  status: string;
  msg?: string;
};

const WordleGame = () => {
  const [input, setInput] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [unique, setUnique] = useState<string>('false');
  const [wordLength, setWordLength] = useState<string>('5');
  const [gameData, setGameData] = useState<GameData>();
  const [guessResponse, setGuessResponse] = useState<GuessResponse>();
  const [message, setMessage] = useState<string>('Login or play as a guest!');
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const [lang, setLang] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userStatement, setUserStatement] = useState<UserStatement>('notReadyToPlay');
  const [playAsGuest, setPlayAsGuest] = useState<boolean>(false);

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  const sendWord = async () => {
    try {
      if (!gameData) {
        setMessage('Game data is missing');
        return;
      }

      setMessage('Checking word...');
      const response = await fetch(`/api/games/${gameData.gameId}/guesses`, {
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
        setMessage('Something went wrong!');
      }

      setInput('');
    } catch {
      setMessage('Error connecting to the server or game is not found');
    }
  };

  const startGame = async () => {
    try {
      const token = localStorage.getItem('token');
      setMessage('Starting game...');
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ playerId: id, length: wordLength, unique: unique, lang: lang }),
      });
      const data = await response.json();
      setGameData(data);
      if (!data.msg) {
        setTimerRunning(true);
      }
    } catch {
      setMessage('Error connecting to the server or game is not found');
    }
  };

  useEffect(() => {
    if (gameData?.status) {
      setMessage(gameData?.status);
    }
  }, [gameData]);

  useEffect(() => {
    if (guessResponse?.msg) {
      setMessage(guessResponse.status);
      setTimeout(() => {
        setMessage(gameData?.status ?? '');
      }, 5000);
    }
  }, [guessResponse, gameData]);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        const response = await fetch('/api/users/current', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setIsLoggedIn(true);
          setMessage(`Welcome ${data.name} Good luck!`);
          setUserStatement('readyToPlay');
        } else {
          console.log('Error', data.message);
        }
      }
    };

    checkToken();
  }, [userStatement]);

  useEffect(() => {
    if (guessResponse?.result === true) {
      setMessage(guessResponse.status);
      setTimerRunning(false);
    }
  }, [guessResponse]);
  return (
    <>
      <div className="game__container">
        {gameData && (
          <CoinInfo
            isLoggedIn={isLoggedIn}
            timerRunning={timerRunning}
            gameId={gameData.gameId}
            setMessage={setMessage}
            message={message}
          />
        )}
        <h1 className="game__message">{message}</h1>
        {!playAsGuest && userStatement === 'notReadyToPlay' && !timerRunning && (
          <Login
            setMessage={setMessage}
            setUserStatement={setUserStatement}
            setPlayAsGuest={setPlayAsGuest}
          />
        )}
        {!playAsGuest && userStatement === 'register' && !timerRunning && (
          <Register
            setMessage={setMessage}
            setUserStatement={setUserStatement}
            setPlayAsGuest={setPlayAsGuest}
          />
        )}
        {userStatement === 'readyToPlay' && !timerRunning && (
          <GameStart
            id={id}
            setId={setId}
            unique={unique}
            setUnique={setUnique}
            wordLength={wordLength}
            setWordLength={setWordLength}
            startGame={startGame}
            lang={lang}
            setLang={setLang}
            isLoggedIn={isLoggedIn}
            setPlayAsGuest={setPlayAsGuest}
            setMessage={setMessage}
            setUserStatement={setUserStatement}
            setIsLoggedIn={setIsLoggedIn}
          />
        )}
        {timerRunning && (
          <>
            <Timer gameData={gameData} timerRunning={timerRunning} />
            <GamePlay
              isChecked={isChecked}
              handleChange={handleChange}
              input={input}
              setInput={setInput}
              wordLength={wordLength}
              sendWord={sendWord}
            />
            {guessResponse && <GameResults guessResponse={guessResponse} />}
          </>
        )}
      </div>
    </>
  );
};

export default WordleGame;
