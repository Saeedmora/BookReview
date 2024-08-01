import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/main');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100'>
      <Header />
      <div className='bg-white p-8 rounded shadow-md w-full max-w-md mt-8'>
        <h2 className='text-2xl font-bold mb-6'>Login</h2>
        <form onSubmit={handleLogin} className='space-y-6'>
          <div>
            <label className='block mb-2'>Email:</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full p-2 border border-gray-300 rounded'
            />
          </div>
          <div>
            <label className='block mb-2'>Password:</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full p-2 border border-gray-300 rounded'
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
          >
            Login
          </button>
        </form>
        <p className='mt-4'>
          Don't have an account?{' '}
          <Link to='/register' className='text-blue-500'>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
