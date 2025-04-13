import { useEffect, useState } from "react";

const GameResults = ({ guessResponse }) => {
  const [prevResult, setPrevResult] = useState([]);

  useEffect(() => {
    if (guessResponse.result && Array.isArray(guessResponse.result)) {
      setPrevResult((prevResult) => {
      const newResult = [ guessResponse.result, ...prevResult];
      
      return newResult.slice(0, 5);
    });
  }
  }, [guessResponse]);

  const printChars = (result) => {
    if (!Array.isArray(result)) return null;

    return (
      <div className="result-item">
        {result.map((item, index) => {
          let className = 'result-item';

          if (item.result === 'incorrect') {
            className += ' incorrect';
          } else if (item.result === 'correct') {
            className += ' correct';
          } else if (item.result === 'misplaced') {
            className += ' misplaced';
          }

          return (
            <span key={index} className={className}>
              {item.letter.toUpperCase()}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="result-container">
      {prevResult.map((result, index) => (
        <div key={index}>
          {printChars(result)}
        </div>
      ))}
    </div>
  );
};

export default GameResults;