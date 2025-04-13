const GameStart = ({isLoggedIn, id, setId, unique, setUnique, wordLength, setWordLength, startGame, lang, setLang, setPlayAsGuest, setMessage, setUserStatement, setIsLoggedIn }) => {

  return (
    <div className='game__top'>
      {!isLoggedIn && (<input
        className="game__input"
        value={id}
        placeholder="Enter your name"
        onChange={(e) => setId(e.target.value)}
      />)}

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

      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        <option value="">Select an language</option>
        <option value="english">English</option>
        <option value="swedish">Swedish</option>
        <option value="russian">Russian</option>
      </select>

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
      {!isLoggedIn && (<span className="game__text" onClick={() => { setPlayAsGuest(false); setMessage('Login'); setUserStatement('notReadyToPlay'); }}>
        Login
      </span>)}
      {isLoggedIn && (<span className="game__text" onClick={() => { localStorage.removeItem('token'); setUserStatement('notReadyToPlay'); setIsLoggedIn(false)}}>
        Logout
      </span>)}
    </div>
  )
}
export default GameStart;