import { useState, useEffect } from 'react';
import { currentTime } from '../../../backend/logic/currentTime';

const WordleGame = () => {
  const [input, setInput] = useState('');
  const [id, setId] = useState('');
  const [unique, setUnique] = useState(false);
  const [wordLength, setWordLength] = useState(5);
  const [time, setTime] = useState('');
  const [gameData, setGameData] = useState(null);
  const [guessResponse, setGuessResponse] = useState();
  const [message, setMessage] = useState('Choose settings and click Start game!');
  const [timerRunning, setTimerRunning] = useState(false);

  const handleInputWord = (e) => {
    setInput(() => e.target.value);
  };

  const handleUniqueStatus = (e) => {
    setUnique(() => e.target.value);
  };

  const handleWordLength = (e) => {
    setWordLength(() => e.target.value);
  };

  const handleIdChange = (e) => {
    setId(() => e.target.value);
  };

  const sendWord = async () => {
    try {
      const response = await fetch('/api/game/guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId: id, guess: input }),
      });
      const data = await response.json();
      setGuessResponse(data);
      setInput('')
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const startGame = async () => {
    try {
      const response = await fetch('/api/game/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId: id, length: wordLength, unique: unique }),
      });
      const data = await response.json();
      setGameData(data);
      setTimerRunning(true);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  useEffect(() => {
    if (gameData) {
      setMessage(gameData.status);
    }
  }, [gameData]);

  const printChars = () => {
    if (!guessResponse?.result) {
      return null;
    } else if (guessResponse.result === true) {
    } else {
      return guessResponse.result.map((item, index) => (
        <span
          key={index}
          className={`result-item ${
            item.result === 'correct'
              ? 'correct'
              : item.result === 'present'
                ? 'present'
                : 'incorrect'
          }`}
        >
          {item.letter.toUpperCase()}
        </span>
      ));
    }
    return null;
  };

  useEffect(() => {
    if (guessResponse?.result === true) {
      setTimerRunning(false);
      setMessage(
        `You won! The ${id} guessed the ${guessResponse.guess} correctly. Time is ${time} seconds.`
      );
    }
  }, [guessResponse]);

  useEffect(() => {
    if (!gameData || !gameData.gameStarted || !timerRunning) return;

    const [hours, minutes, seconds] = gameData.gameStarted.split(':').map(Number);
    const [hours2, minutes2, seconds2] = currentTime().split(':').map(Number);

    const timeInSec =
      hours2 * 3600 + minutes2 * 60 + seconds2 - (hours * 3600 + minutes * 60 + seconds);

    const intervalId = setInterval(() => {
      setTime(timeInSec);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  });

  return (
    <div className="game__container">
      <h1>{message}</h1>
      <p>Time: {time}</p>
      <input value={id} placeholder="Name" onChange={handleIdChange} />
      <section>
        <label>
          <input
            type="radio"
            value="true"
            checked={unique === 'true'}
            onChange={handleUniqueStatus}
          />
          Unique
        </label>
        <label>
          <input
            type="radio"
            value="false"
            checked={unique === 'false'}
            onChange={handleUniqueStatus}
          />
          Not Unique
        </label>
      </section>
      <p>Word length:</p>
      <input type="number" value={wordLength} onChange={handleWordLength} />
      <button onClick={startGame}>Start game!</button>
      <p className="game__container__word">The guessed word is: {input.toUpperCase()}</p>
      <input
        className="game__container__input"
        type="text"
        value={input}
        onChange={handleInputWord}
        maxLength={gameData?.length || wordLength}
      />
      <button onClick={sendWord}>Guess!</button>
      <div className="result-container">{printChars()}</div>
    </div>
  );
};

export default WordleGame;
