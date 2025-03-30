import classes from './ReactLogo.module.css';
import reactLogo from '../../../assets/react.svg';

export const ReactLogo = () => {
  return (
    <div>
      <a href="" target="_blank">
        <img src={reactLogo} className={classes.logo} alt="React logo" />
      </a>
    </div>
  );
};
