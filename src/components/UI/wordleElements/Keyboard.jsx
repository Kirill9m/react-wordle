import classes from './Keyboard.module.css';

export const Keyboard = () => {
  const keyboardSE = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'Å',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'Ö',
    'Ä',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
  ];

  const printKeyboard = (lang) => {
    return lang.map((key, index) => (
      <button key={index} className={classes.keyboard}>
        {key}
      </button>
    ));
  };

  return (
    <div>
      <h1>Keyboard</h1>
      {printKeyboard(keyboardSE)}
    </div>
  );
};
