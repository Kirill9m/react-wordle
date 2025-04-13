import { useState } from "react";

const Login = ({setPlayAsGuest, setMessage}) => {
   const [name, setName] = useState('');
   const [password, setPassword] = useState('');

   const login = async () => {
    try {
      const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: name, password: password }),
      });
      const data = await response.json();
      if (data.token){
        localStorage.setItem('token', data.token);
        console.log(data);
        setPlayAsGuest(false);
      } else{
        setMessage('Failed login!')
      }
   } catch (err){
    console.log(err);
  }
}
   
   return(
    
<div className='game__top1'>
      <label>
        <input
          type="email"
          className="game__input"
          placeholder="Email"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

      <button className='game__button start-button' onClick={login}>Login</button>
      <span className="game__text" onClick={() => (setPlayAsGuest(false)) (setMessage('Play as guest'))}>Play as guest</span>
    </div>
   )
}

export default Login;