import { FC } from 'react';

type Props = {
  isChecked: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  input: string;
  setInput: (value: string) => void;
  wordLength: string;
  sendWord: () => void;
};

const GamePlay: FC<Props> = ({
  isChecked,
  handleChange,
  input,
  setInput,
  wordLength,
  sendWord,
}) => {
  const maxLengthAsNumber = parseInt(wordLength, 10)
  return (
    <div className="game__bottom">
      <label className="game__highscore">
        I want to be part of the highscore list:
        <input type="checkbox" checked={isChecked} onChange={handleChange} />
      </label>

      <p className="game__guessed-word">The guessed word is: {input.toUpperCase()}</p>

      <input
        className="game__input guess-input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        maxLength={maxLengthAsNumber}
      />

      <button className="game__button guess-button" onClick={sendWord}>
        Guess!
      </button>
    </div>
  );
};

export default GamePlay;
