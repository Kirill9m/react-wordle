import { useState } from "react";

const Register = ({setPlayAsGuest, setMessage}) => {
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const register = async () => {
    try {
      const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: name, email: email, password: password }),
      });
      const data = await response.json();
      if (data.token){
        localStorage.setItem('token', data.token);
        console.log(data);
        setPlayAsGuest(false);
      } else{
        setMessage('Failed register!')
      }
   } catch (err){
    console.log(err);
  }
}
   
   return(
    
<div className='game__top'>
      <label>
      <input
          type="name"
          className="game__input"
          placeholder="Email"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          className="game__input"
          placeholder="Email"
          value={name}
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
      <span className="game__text" onClick={() => (setPlayAsGuest(false)) (setMessage('Please login'))}>Login</span>
      <span className="game__text" onClick={() => (setPlayAsGuest(false)) (setMessage('Play as guest'))}>Play as guest</span>
    </div>
   )
}

export default Register;