"use client";
import React, { useState } from 'react';
import axios from 'axios';
//import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/navigation';

/* interface JwtPayload {
    role: string;
} */

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/login', { email, password });
      //const { token, role } = res.data;

      //localStorage.setItem('token', token);

      //const decoded = jwt_decode<JwtPayload>(token);

      console.log(res.data);
      console.log(res);
      if (res.data.role === 'admin') {
        router.push('/homeA');
      } else if (res.data.role === 'user') { //else if (decoded.role === 'user') {
        localStorage.setItem('userEmail', email);
        router.push('/homeU');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
