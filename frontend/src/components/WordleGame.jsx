import { useState, useEffect } from 'react';
import { currentTime } from '../../../backend/logic/currentTime';
import GameStart from './GameStart';
import GamePlay from './GamePlay';

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
  const [lang, setLang] = useState(null);

  const handleInputWord = (e) => {
    setInput(() => e.target.value);
  };

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
      
      if (data?.status){
        setMessage(data.status);
      }else{
        setMessage('Something went wrong!')
      }

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
      setMessage('Starting game...')
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId: id, length: wordLength, unique: unique, lang:lang }),
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

      {!timerRunning && (
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
      {timerRunning && (
        <GamePlay 
        isChecked={isChecked}
        handleChange={handleChange}
        time={time}
        input={input}
        setInput={setInput}
        wordLength={wordLength}
        sendWord={sendWord}
        printChars={printChars}
        />
      )}
    </div>
  );
};

export default WordleGame;
