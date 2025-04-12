const GameResults = ({ guessResponse }) => {
  const printChars = () => {
    if (guessResponse.result === true) return null;
    if (!Array.isArray(guessResponse.result)) return null;

    return (
      <div className="result-item">
        {guessResponse.result.map((item, index) => {
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

  return <div className="result-container">{printChars()}</div>
};

export default GameResults;