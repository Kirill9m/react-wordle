import { useState } from 'react';

const WordleGame = () => {
  const [input, setInput] = useState('');
  const [id, setId] = useState('');
  const [unique, setUnique] = useState(false);

  const handleInputWord = (e) => {
    setInput(() => e.target.value);
  };

  const handleUniqueStatus = (e) => {
    setUnique(() => e.target.value);
  };

  const sendWord = async () => {
    try {
      const response = await fetch('/api/game/guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId: 1, guess: input }),
      });
      const data = await response.json();
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  return (
    <div className="game__container">
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
