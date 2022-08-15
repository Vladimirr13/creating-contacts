import React from 'react';
import { NavLink } from 'react-router-dom';
import { RoutesEnum } from '../../routes';
import SVG from 'react-inlinesvg';
import IconNotFound from '../../assets/icons/icon-not-found.svg';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <SVG src={IconNotFound} />
      <h2 className='title'>Маршрут не найден :(</h2>
      <NavLink to={RoutesEnum.MAIN} className="main-button">
        на главную
      </NavLink>
    </div>
  );
};

export default NotFoundPage;
