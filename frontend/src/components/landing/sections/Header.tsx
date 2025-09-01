import React from 'react';

const Header: React.FC = () => (
  <header className="header">
    <div className="mcontainer">
      <div className="header__wrapper">
        <div className="header__logo">
          <div className="header__logo-link">
            <img className="header__logo-link-image" src="/assets/logo.svg" alt="logo" />
          </div>
        </div>

        <nav className="header__nav">
          <div className="header__nav-wrapper">
            <div className="header__logo">
              <div className="header__logo-link">
                <img className="header__logo-link-image" src="/assets/logo.svg" alt="logo" />
              </div>
            </div>

            <div className="header__close">
              <button className="header__close-button"></button>
            </div>

            <ul className="header__nav-menu">
              <li className="header__nav-menu-item">
                <a className="header__nav-menu-item-link" href="#">Услуги</a>
              </li>
              <li className="header__nav-menu-item">
                <a className="header__nav-menu-item-link" href="#">Заказы</a>
              </li>
              <li className="header__nav-menu-item">
                <a className="header__nav-menu-item-link" href="#">Эксперты</a>
              </li>
              <li className="header__nav-menu-item">
                <a className="header__nav-menu-item-link" href="#">Магазин</a>
              </li>
              <li className="header__nav-menu-item">
                <a className="header__nav-menu-item-link" href="#">FAQ</a>
              </li>
              <li className="header__nav-menu-item">
                <a className="header__nav-menu-item-link" href="#">Поддержка</a>
              </li>
              <li className="header__nav-menu-item">
                <a className="header__nav-menu-item-link" href="#">Стать экспертом</a>
              </li>
              <li className="header__nav-menu-item">
                <a className="header__nav-menu-item-link" href="#">Стать партнерам</a>
              </li>
            </ul>

            <div className="header__cabinet">
              <button className="header__cabinet-button button">Личный кабинет</button>
            </div>
          </div>
        </nav>

        <div className="header__cabinet">
          <button className="header__cabinet-button button">Личный кабинет</button>
        </div>

        <div className="header__burger">
          <button className="header__burger-button"></button>
        </div>
      </div>
    </div>
  </header>
);

export default Header;



