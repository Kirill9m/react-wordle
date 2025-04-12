const GamePlay = ({ isChecked, handleChange, input, setInput, wordLength, sendWord }) => {
  return(<div className='game__bottom'>
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
          maxLength={wordLength}
        />

        <button className="game__button guess-button" onClick={sendWord}>
          Guess!
        </button>
      </div>
)}

export default GamePlay;