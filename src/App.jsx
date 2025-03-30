import { ReactLogo } from './components/UI/logo/ReactLogo';
import { Keyboard } from './components/UI/wordleElements/Keyboard';
import { GameField } from './components/UI/wordleElements/GameField';

function App() {
  return (
    <div>
      <header className="header">
        <ReactLogo />
        <h1 className="header__text">A React-powered Wordle game</h1>
      </header>
      <GameField />
      <Keyboard />
    </div>
  );
}

export default App;
