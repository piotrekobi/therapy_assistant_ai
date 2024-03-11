// src/components/LanguageSelect.js
import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import '../css/LanguageSelect.css';


const LanguageSelect = () => {
  const { language, setLanguage } = useContext(AppContext);

  return (
    <div className="language-select">
      <label htmlFor="languageSelect">Język ćwiczeń: </label>
      <select id="languageSelect" value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="pl">Polski</option>
        <option value="en">Angielski</option>
      </select>
    </div>
  );
};

export default LanguageSelect;
