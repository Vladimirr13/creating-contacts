import React from 'react';
import AuthorizationService from '../../services/AuthorizationService';

const Header: React.FC = (props) => {
  const { userLogout } = AuthorizationService;
  return (
    <div className='header'>
      <button onClick={userLogout} className='main-button'>Выход</button>
    </div>
  );
};

export default Header;
