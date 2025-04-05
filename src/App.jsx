import { useEffect, useState } from 'react';
import Header from './components/Header';

function App() {
  const [input, setInput] = useState('');

  useEffect(() => {
    document.title = 'Wordle React'
  }, [])


  return (
    <div>
        <Header/>
    </div>
  );
}

export default App;
