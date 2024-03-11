// src/components/MenuBar.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../css/MenuBar.css';

const MenuBar = () => {
    return (
        <div className="menu-bar">
            <Link to="/generator" className="menu-item">Generator samogłosek, słów i zdań</Link>
            <Link to="/chat" className="menu-item">Rozmowa z asystentem</Link>
            <Link to="/intonation-training" className="menu-item">Trening intonacji</Link>
            <Link to="/statistics" className="menu-item">Statystyki</Link>
            <Link to="/personalization" className="menu-item">Personalizacja</Link>
            <Link to="/community" className="menu-item">Społeczność</Link>
        </div>
    );
};

export default MenuBar;
