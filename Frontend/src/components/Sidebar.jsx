import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faUser,
  faPen,
  faRightFromBracket,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import Logout from './Logout.jsx';

const Sidebar = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { userData, updateUserData } = useAuth();

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (userData && userData.user.profileImageUrl) {
        setProfileImage(userData.user.profileImageUrl);
      }
    };

    fetchProfileImage();
  }, [userData]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (!file) {
      console.error('Keine Datei ausgewählt');
      return;
    }

    const formData = new FormData();
    formData.append('profileImageUrl', file);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/${userData.user._id}/profile-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userData.token}`,
          },
          withCredentials: true,
        }
      );

      const updatedUser = {
        ...userData.user,
        profileImageUrl: response.data.profileImageUrl,
      };
      updateUserData({ ...userData, user: updatedUser });
      setProfileImage(response.data.profileImageUrl);
      setSelectedFile(null); // Clear the selected file
    } catch (error) {
      console.error('Fehler beim Hochladen des Profilbilds:', error);
    }
  };

  const handleEditClick = () => {
    document.getElementById('file').click();
  };

  return (
    <div className='w-full lg:w-1/5 bg-gray-100 p-4 h-full rounded-lg font-montserrat'>
      <div className='mb-4 flex items-center'>
        <div className='relative'>
          {profileImage ? (
            <img
              src={profileImage}
              alt='Profilbild'
              className='w-16 h-16 rounded-full mb-2'
            />
          ) : (
            <div className='w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-2'>
              <img
                src='https://t3.ftcdn.net/jpg/05/53/79/60/360_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg'
                alt='default user icon'
                className='rounded-full'
              />
            </div>
          )}
          <input
            type='file'
            id='file'
            className='hidden'
            onChange={handleFileChange}
          />
          <FontAwesomeIcon
            icon={faEdit}
            className='absolute bottom-0 right-0 text-gray-700 bg-white rounded-full p-1 cursor-pointer'
            onClick={handleEditClick}
          />
        </div>
        <div className='ml-4'>
          {userData && (
            <>
              <h2 className='text-lg font-semibold'>
                Hey, {userData.user.username}
              </h2>
            </>
          )}
        </div>
      </div>
      <h2 className='text-lg font-semibold mb-4'>Navigation</h2>
      <ul className='nav-links mb-4'>
        <li className='mb-2 flex items-center'>
          <FontAwesomeIcon
            icon={faHeart}
            className='mr-2'
            style={{ color: 'red' }}
          />
          <Link to='/favorites' className='hover:underline'>
            Favoriten
          </Link>
        </li>
        <li className='mb-2 flex items-center'>
          <FontAwesomeIcon icon={faPen} className='mr-2' />
          <Link to='/my-reviews' className='hover:underline'>
            Meine Reviews
          </Link>
        </li>
        <li className='mb-2 flex items-center'>
          <FontAwesomeIcon icon={faUser} className='mr-2' />
          <Link to='/account' className='hover:underline'>
            Konto Info
          </Link>
        </li>
        <li className='flex items-center hover:underline'>
          <FontAwesomeIcon icon={faRightFromBracket} className='mr-2' />
          <Logout />
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
