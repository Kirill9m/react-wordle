import reactLogo from '../assets/react.svg'

const Header = () => {
  return (
    <div className='header'>
      <img src={reactLogo} className='header__img' alt="React logo" />
      <h1 className='header__text'>A React-powered Wordle game</h1>
    </div>
  );
};

export default Header;