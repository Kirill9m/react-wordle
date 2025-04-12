import { useState, useEffect } from 'react';
import { currentTime } from '../../../backend/logic/currentTime';

const WordleGame = () => {
  const [input, setInput] = useState('');
  const [id, setId] = useState('');
  const [unique, setUnique] = useState(false);
  const [wordLength, setWordLength] = useState(5);
  const [time, setTime] = useState('');
  const [gameData, setGameData] = useState(null);
  const [guessResponse, setGuessResponse] = useState({});
  const [message, setMessage] = useState("Enter your name and click 'Start Game'!");
  const [timerRunning, setTimerRunning] = useState(false);
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
      const response = await fetch(`/api/games/${gameData.gameId}/guesses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guess: input, highscore: isChecked }),
      });
      const data = await response.json();
      setGuessResponse(data);
      setInput('');
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const handleSendWordKeyDown = (keyCode) => {
    if (keyCode.key === 'Enter') {
      keyCode.preventDefault();
      sendWord();
    }
  };

  const startGame = async () => {
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId: id, length: wordLength, unique: unique }),
      });
      const data = await response.json();
      setGameData(data);
      if (!data.msg) {
        setTimerRunning(true);
      }
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const handleStartGameKeyDown = (keyCode) => {
    if (keyCode.key === 'Enter') {
      keyCode.preventDefault();
      startGame();
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
  }, [guessResponse]);

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

  useEffect(() => {
    if (!gameData || !gameData.gameStarted || !timerRunning) return;

    let time = Math.round((new Date() - new Date(gameData.gameStarted)) / 1000);
    const intervalId = setInterval(() => {
      setTime(time);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  });

  return (
    <div className="game__container">
      <h1 className="game__message">{message}</h1>
      <div className={`game__top ${timerRunning ? 'hidden' : ''}`}>
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
          onKeyDown={handleStartGameKeyDown}
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
          onKeyDown={handleSendWordKeyDown}
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
