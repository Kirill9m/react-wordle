import { useState } from "react";

const Register = ({ setPlayAsGuest, setMessage, setUserStatement }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = async () => {
    try {
      setMessage('Checking data...')
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name, email: email, password: password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log(data);
        setPlayAsGuest(false);
        setUserStatement('readyToPlay');
      } else {
        setMessage(data.status)
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (

    <div className='game__top'>
      <label>
        <input
          type="text"
          className="game__input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        </label>
        <label>
        <input
          type="email"
          className="game__input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        <input
          type="password"
          className="game__input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      <button className='game__button start-button' onClick={register}>Register</button>
      <span className="game__text" onClick={() => { setPlayAsGuest(true); setMessage('Play as guest'); setUserStatement('readyToPlay'); }}>
        Play as guest
      </span>
      <span className="game__text" onClick={() => { setPlayAsGuest(false); setMessage('Login'); setUserStatement('notReadyToPlay'); }}>
        Login
      </span>
    </div>
  )
}

export default Register;