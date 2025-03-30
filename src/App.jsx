import { ReactLogo } from './components/UI/logo/ReactLogo';
import { Keyboard } from './components/UI/wordleElements/Keyboard';

function App() {
  return (
    <div>
      <header className="header">
        <ReactLogo />
        <h1 className="header__text">A React-powered Wordle game</h1>
      </header>
      <section>
        <Keyboard />
      </section>
    </div>
  );
}

export default App;
