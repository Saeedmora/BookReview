import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Header = () => {
  const { isLoggedIn, userData } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (userData) {
      navigate('/main');
    } else {
      navigate('/');
    }
  };

  return (
    <header className='bg-gray-800 text-white p-4 flex justify-between items-center'>
      <div
        className='text-2xl font-bold cursor-pointer'
        onClick={handleLogoClick}
      >
        PBR
      </div>
      <nav>
        <ul className='flex space-x-4'>
          <li>
            <Link to='/about-us' className='hover:text-gray-400'>
              About Us
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
