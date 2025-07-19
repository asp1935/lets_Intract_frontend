import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const ThemeSwitcher = ({ color, themes, onThemeChange }) => {


  const [activeTheme, setActiveTheme] = useState(color);

  useEffect(() => {
    setActiveTheme(color);
  }, [color]);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', activeTheme);
    if (onThemeChange) {
      onThemeChange(activeTheme);
    }
  }, [activeTheme, onThemeChange]);

  const handleThemeClick = useCallback((theme) => {
    setActiveTheme(theme);
  }, []);
  if (!Array.isArray(themes) || themes.length === 0) {
    console.error('Invalid prop `themes`: Expected a non-empty array of strings.');
    return null;
  }
  return (
    <div className="theme-switcher flex space-x-2" role="group" aria-label="Theme switcher">
      {themes.map((themeColor, index) => (
        <button
          key={index}
          className={`theme-option w-8 h-8 rounded-full focus:outline-none transition-transform duration-300 ${activeTheme === themeColor ? 'ring-2 ring-blue-500' : ''
            }`}
          style={{ backgroundColor: themeColor }}
          onClick={() => handleThemeClick(themeColor)}
          aria-label={`Theme option ${index + 1}`}
          aria-pressed={activeTheme === themeColor}
        />
      ))}
    </div>
  );
};

ThemeSwitcher.propTypes = {
  color: PropTypes.string.isRequired,
  themes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onThemeChange: PropTypes.func,
};

ThemeSwitcher.defaultProps = {
  onThemeChange: () => { },
};

export default ThemeSwitcher;
