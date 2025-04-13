import { useEffect } from 'react';
import Header from './components/Header';
import WordleGame from './components/WordleGame';


function App() {
  
  useEffect(() => {
    document.title = 'Wordle React'
  }, [])


  return (
    <div>
        <Header/>
        <WordleGame/>
    </div>
  );
}

export default App;
