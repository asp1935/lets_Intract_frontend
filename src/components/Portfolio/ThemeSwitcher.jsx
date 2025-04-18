import React, { useState, useEffect } from 'react';

const ThemeSwitcher = ({ themes, onThemeChange }) => {
  // Validate props
  if (!Array.isArray(themes) || themes.length === 0) {
    console.error('Invalid prop `themes`: Expected an array of strings.');
    return null; // or return a fallback UI
  }

  const [activeTheme, setActiveTheme] = useState(themes[0]);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', activeTheme);
    if (onThemeChange) {
      onThemeChange(activeTheme);
    }
  }, [activeTheme, onThemeChange]);

  return (
    <div className="theme-switcher flex space-x-2" role="group" aria-label="Theme switcher">
      {themes.map((color, index) => (
        <button
          key={index}
          className={`theme-option w-8 h-8 rounded-full focus:outline-none transition-transform duration-300 ${activeTheme === color ? 'ring-2 ring-blue-500' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => setActiveTheme(color)}
          aria-label={`Theme option ${index + 1}`}
          aria-pressed={activeTheme === color}
        />
      ))}
    </div>
  );
};

export default ThemeSwitcher;