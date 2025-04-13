import { useState, useEffect } from 'react';
import GameStart from './GameStart';
import GamePlay from './GamePlay';
import GameResults from './GameResults';
import Timer from './Timer';
import Login from './Login';

const WordleGame = () => {
  const [input, setInput] = useState('');
  const [id, setId] = useState('');
  const [unique, setUnique] = useState(false);
  const [wordLength, setWordLength] = useState(5);
  const [gameData, setGameData] = useState(null);
  const [guessResponse, setGuessResponse] = useState({});
  const [message, setMessage] = useState("Auth or play as guest!");
  const [timerRunning, setTimerRunning] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [lang, setLang] = useState(undefined);
  const [playAsGuest, setPlayAsGuest] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  const sendWord = async () => {
    try {
      setMessage('Checking word...')
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
        setMessage('Something went wrong!')
      }

      setInput('');
    } catch {
      setMessage('Error connecting to the server or game is not found')
    }
  };

  const startGame = async () => {
    try {
      const token = localStorage.getItem('token');
      setMessage('Starting game...')
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ playerId: id, length: wordLength, unique: unique, lang: lang }),
      });
      const data = await response.json();
      setGameData(data);
      if (!data.msg) {
        setTimerRunning(true);
      }
    } catch {
      setMessage('Error connecting to the server or game is not found')
    }
  };

  useEffect(() => {
    if (gameData) {
      setMessage(gameData?.status);
    }
  }, [gameData]);

  useEffect(() => {
    if (guessResponse?.msg) {
      setMessage(guessResponse.status)
      setTimeout(() => {
        setMessage(gameData?.status);
      }, 5000)
    }
  }, [guessResponse, gameData]);

  const printChars = () => {
    if (guessResponse.result === true) return null;
    if (!Array.isArray(guessResponse.result)) return null;

    return (
      <div className="result-item">
        {guessResponse.result.map((item, index) => {
          let className = 'result-item';
          if (item.result === 'incorrect') {
            className += ' incorrect';
          } else if (item.result === 'correct') {
            className += ' correct';
          } else if (item.result === 'misplaced') {
            className += ' misplaced';
          }

          return (
            <span key={index} className={className}>
              {item.letter.toUpperCase()}
            </span>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    if (guessResponse?.result === true) {
      setMessage(guessResponse.status);
      setTimerRunning(false);
    }
  }, [guessResponse]);

  return (
    <div className="game__container">
      <h1 className="game__message">{message}</h1>
      {playAsGuest && (<Login setPlayAsGuest={setPlayAsGuest} setMessage={setMessage}/>)}
      {!playAsGuest && !timerRunning && (
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
        />
      )}
      {!playAsGuest && timerRunning && (
        <>
          <Timer gameData={gameData} timerRunning={timerRunning} />
          <GamePlay
            isChecked={isChecked}
            handleChange={handleChange}
            input={input}
            setInput={setInput}
            wordLength={wordLength}
            sendWord={sendWord}
            printChars={printChars}
          />
          <GameResults guessResponse={guessResponse} />
        </>
      )}
    </div>
  );
};

export default WordleGame;
