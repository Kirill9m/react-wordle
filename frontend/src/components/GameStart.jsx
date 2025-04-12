const GameStart = ({ id, setId, unique, setUnique, wordLength, setWordLength, startGame }) => {
  return (
    <div className='game__top'>
      <input
        className="game__input"
        value={id}
        placeholder="Enter your name"
        onChange={(e) => setId(e.target.value)}
      />

      <section className="settings">
        <label>
          <input
            type="radio"
            value="true"
            checked={unique === 'true'}
            onChange={(e) => setUnique(e.target.value)}
          />
          Unique
        </label>
        <label>
          <input
            type="radio"
            value="false"
            checked={unique === 'false'}
            onChange={(e) => setUnique(e.target.value)}
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
        onChange={(e) => setWordLength(e.target.value)}
      />

      <button className="game__button start-button" onClick={startGame}>
        Start Game
      </button>
    </div>
  )
}

export default GameStart;