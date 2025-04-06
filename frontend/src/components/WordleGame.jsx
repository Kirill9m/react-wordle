import { useState } from 'react';

const WordleGame = () => {
  const [input, setInput] = useState('');
  const [id, setId] = useState('');
  const [unique, setUnique] = useState(false);
  const [wordLength, setWordLength] = useState(5);

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
  }

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
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  return (
    <div className="game__container">
      <p>Name/id: {id}</p>
      <input value={id} onChange={handleIdChange} />
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
      <p>Word length:</p>
      <input type="number" value={wordLength} onChange={handleWordLength} />
      <button onClick={startGame}>Start game!</button>

      <p className="game__container__word">The guessed word is: {input}</p>
      <input
        className="game__container__input"
        type="text"
        value={input}
        onChange={handleInputWord}
      />
      <button onClick={sendWord}>Guess!</button>
    </div>
  );
};

export default WordleGame;
