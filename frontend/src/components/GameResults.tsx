import { useEffect, useState, FC, ReactNode } from 'react';

type Result = {
  letter: string;
  result: 'correct' | 'incorrect' | 'misplaced';
};

type GuessResponse = {
  result: Result[] | boolean;
  guess: string;
  timeStarted: string;
  score: number;
  status: string;
  msg?: string;
};

type Props = {
  guessResponse: GuessResponse;
};

const printChars = (result: Result[]): ReactNode => {
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

const GameResults: FC<Props> = ({ guessResponse }) => {
  const [prevResult, setPrevResult] = useState<Result[][]>([]);

  useEffect(() => {
    if (Array.isArray(guessResponse.result)) {
      const currentResultArray = guessResponse.result;
      setPrevResult((currentPrevResults) => {
        const newResultList: Result[][] = [currentResultArray, ...currentPrevResults];
        return newResultList.slice(0, 5);
      });
    }
  }, [guessResponse]);

  return (
    <div className="result-container">
      {prevResult.map((result, index) => (
        <div key={index}>{printChars(result)}</div>
      ))}
    </div>
  );
};

export default GameResults;
