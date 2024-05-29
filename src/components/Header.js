// src/components/Header.js

import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import '../css/Header.css';
import MenuBar from './MenuBar';

const Header = ({ title }) => {
    const { user, logout } = useContext(AppContext);
    return (
        <div className="header-wrapper">
            <header className="header-container">
                {user && (
                    <div className="user-info">
                        Zalogowano jako {user.username}
                        <button onClick={logout} className="logout-button">Wyloguj</button>
                    </div>
                )}
                <h1>{title}</h1>
            </header>
            {user && <MenuBar />}
        </div>
    );
};

export default Header;
