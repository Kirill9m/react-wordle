import classes from './GameField.module.css';
import { useState } from 'react';

export const GameField = () => {
  const table = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 6; col++) {
      table.push({ row, col, value: '' });
    }
  }

  const [tableData, setTableData] = useState(table);

  return (
    <div className={classes.grid}>
      {tableData.flat().map((cell, index) => (
        <div key={index} className={classes.cell}>
          {cell.value}
        </div>
      ))}
    </div>
  );
};
