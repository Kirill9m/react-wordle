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
  const [guessHistory, setGuessHistory] = useState([]);
  const [isChecked, setIsChecked] = useState(true);

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

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  const sendWord = async () => {
    try {
      const response = await fetch('/api/game/guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId: id, guess: input, highscore: isChecked }),
      });
      const data = await response.json();
      setGuessResponse(data);
      setInput('');
      setGuessHistory((prevHistory) => {
        const updatedHistory = [...prevHistory, data];
        return updatedHistory.length > 5 ? updatedHistory.slice(updatedHistory.length - 5) : updatedHistory;
      });
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
      setGuessHistory([]);
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
    return guessHistory.map((item, index) => (
      <div key={index} className="result-item">
        {item.result === true ? (
          <span className="correct">{item.guess.toUpperCase()}</span>
        ) : (
          item.result.map((resultItem, idx) => (
            <span
              key={idx}
              className={`result-item ${
                resultItem.result === 'correct'
                  ? 'correct'
                  : resultItem.result === 'present'
                    ? 'present'
                    : 'incorrect'
              }`}
            >
              {resultItem.letter.toUpperCase()}
            </span>
          ))
        )}
      </div>
    ));
  };

  useEffect(() => {
    if (guessResponse?.result === true) {
      setTimerRunning(false);
      setMessage(
        `Congratulations ${id}! The correct word is: ${guessResponse.guess}. Your score(${guessResponse.score}) has been sent to the highscore.`
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
      <div className={`game__top ${timerRunning ? 'hidden' : ''}`}>
        <h1 className="game__message">{message}</h1>

        <input
          className="game__input"
          value={id}
          placeholder="Enter your name"
          onChange={handleIdChange}
        />

        <section className="settings">
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

        <p className="game__word-length">Word Length:</p>
        <input
          type="number"
          className="game__input"
          value={wordLength}
          min={3}
          max={10}
          onChange={handleWordLength}
        />

        <button className="game__button start-button" onClick={startGame}>
          Start Game
        </button>
      </div>

      <div className={`game__bottom ${!timerRunning ? 'hidden' : ''}`}>
        <label className="game__highscore">
          I want to be part of the highscore list:
          <input type="checkbox" checked={isChecked} onChange={handleChange} />
        </label>

        <p className="game__time">Time: {time}</p>
        <p className="game__guessed-word">The guessed word is: {input.toUpperCase()}</p>

        <input
          className="game__input guess-input"
          type="text"
          value={input}
          onChange={handleInputWord}
          maxLength={gameData?.length || wordLength}
        />

        <button className="game__button guess-button" onClick={sendWord}>
          Guess!
        </button>

        <div className="result-container">{printChars()}</div>
      </div>
    </div>
  );
};

export default WordleGame;
