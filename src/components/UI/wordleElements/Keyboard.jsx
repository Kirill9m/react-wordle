import classes from './Keyboard.module.css';

export const Keyboard = ({ onKeyPress }) => {
  const keyboardSE = 'QWERTYUIOPÅASDFGHJKLÖÄZXCVBNM'.split('');

  const printKeyboard = (lang) => {
    return lang.map((key, index) => (
      <button key={index} className={classes.keyboard__btns} onClick={() => onKeyPress(key)}>
        {key}
      </button>
    ));
  };

  return <div className={classes.keyboard}>{printKeyboard(keyboardSE)}</div>;
};
