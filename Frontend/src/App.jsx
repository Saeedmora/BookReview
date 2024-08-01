import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import MainPage from './pages/MainPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import BookReviewsPage from './pages/BookReviewsPage.jsx';
import UserReviewsPage from './pages/UserReviewsPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import MyReviewsPage from './pages/MyReviewsPage.jsx';
import AboutUsPage from './pages/AboutUsPage.jsx';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';
import Header from './components/Header.jsx';

const PrivateRoute = ({ element }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? element : <Navigate to='/login' />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/about-us' element={<AboutUsPage />} />
          <Route path='/main' element={<MainPage />} />
          <Route path='/book-reviews/:isbn' element={<BookReviewsPage />} />
          <Route path='/user-reviews/:userId' element={<UserReviewsPage />} />
          <Route path='/favorites' element={<FavoritesPage />} />
          <Route path='/my-reviews' element={<MyReviewsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
