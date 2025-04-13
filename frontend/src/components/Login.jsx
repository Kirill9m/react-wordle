import { useState } from "react";

const Login = () => {
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
      if (data.token)
        localStorage.setItem('token', data.token);

      console.log(data);
   } catch (err){
    console.log(err);
  }
}
   
   return(
<div className="login__form">
      <label>
        <input
          type="email"
          className="login__input"
          placeholder="Email"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label>
        <input
          type="password"
          className="login__input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      <button onClick={login}>Login</button>
    </div>
   )
}

export default Login;