import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

const ThemeSection = ({color, themes, onThemeChange }) => {
  return (
    <div className="pt-1 bg-gray-100 py-2 w-full">
      <div className="container mx-auto">
        <div className="flex justify-end">
          <div className="flex items-center mx-auto gap-2">
            <ThemeSwitcher color={color} themes={themes} onThemeChange={onThemeChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSection;