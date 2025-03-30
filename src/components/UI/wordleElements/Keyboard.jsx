import classes from './Keyboard.module.css';

export const Keyboard = () => {
  const keyboardSE = 'QWERTYUIOPÅASDFGHJKLÖÄZXCVBNM'.split('');

  const printKeyboard = (lang) => {
    return lang.map((key, index) => (
      <button key={index} className={classes.keyboard__btns}>
        {key}
      </button>
    ));
  };

  return <div className={classes.keyboard}>{printKeyboard(keyboardSE)}</div>;
};
