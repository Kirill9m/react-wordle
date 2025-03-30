import classes from './Keyboard.module.css';

export const Keyboard = () => {
  const keyboardSE = 'QWERTYUIOPÅASDFGHJKLÖÄZXCVBNM'.split('');

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
