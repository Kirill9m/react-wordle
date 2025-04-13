import { useEffect } from 'react';
import Header from './components/Header';
import WordleGame from './components/WordleGame';
import Login from './components/Login';

function App() {
  
  useEffect(() => {
    document.title = 'Wordle React'
  }, [])


  return (
    <div>
        <Header/>
        <Login/>
        <WordleGame/>
    </div>
  );
}

export default App;
