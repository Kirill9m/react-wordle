import { useState } from "react";


const WordleGame = () => {
  const [input, setInput] = useState('');

  const handleInputWord = (e) => {
    setInput(c => (e.target.value))
  }

  return (
   <div className="game__container">
    <p className="game__container__word">The guessed word is: {input}</p>
    <input className="game__container__input" type="text" value={input} onChange={handleInputWord}/>
   </div>
  )
}

export default WordleGame;