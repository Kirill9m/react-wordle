import { useEffect, useState, FC } from 'react';
import { ReactNode } from 'react';

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

const printChars = (result: Result[], rowIndex: number): ReactNode => {
  // Проверка на массив
  if (!Array.isArray(result)) return null;

  return (
    <div className="result-row" key={`result-row-${rowIndex}`}>
      {result.map((item, itemIndex) => {
        let className = 'result-item';

        if (item.result === 'incorrect') {
          className += ' incorrect';
        } else if (item.result === 'correct') {
          className += ' correct';
        } else if (item.result === 'misplaced') {
          className += ' misplaced';
        }

        return (
          <span key={`result-item-${rowIndex}-${itemIndex}`} className={className}>
            {item.letter.toUpperCase()}
          </span>
        );
      })}
    </div>
  );
};

const GameResults: FC<Props> = ({ guessResponse }) => {
  // --- ИСПРАВЛЕНИЕ: Тип состояния - массив массивов Result ---
  const [prevResult, setPrevResult] = useState<Result[][]>([]);

  useEffect(() => {
    // Обновляем, только если результат - массив
    if (Array.isArray(guessResponse.result)) {
      setPrevResult((currentPrevResults) => {
        const newResultList: Result[][] = [guessResponse.result, ...currentPrevResults];
        return newResultList.slice(0, 6);
      });
    }
  }, [guessResponse]);

  return (
    <div className="result-container">
      {/* Итерируем по массиву массивов */}
      {prevResult.map((singleResultArray, index) => (
        printChars(singleResultArray, index)
      ))}
    </div>
  );
};

export default GameResults;
