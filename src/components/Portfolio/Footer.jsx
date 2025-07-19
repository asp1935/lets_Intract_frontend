import React from 'react';

const Footer = () => {
  return (
  <footer className="footer-section text-white py-6">
  <div className="container mx-auto px-4">
    <div className="flex justify-center items-center">
      <p className="text-gray-300 text-sm text-center">
        &copy; <b>CopyRight {new Date().getFullYear()} 
        <a 
          href="http://jijausoftwares.in//" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-white hover:text-yellow-400 transition-colors ml-1"
        >
          Jijau Software
        </a></b>
      </p>
    </div>
  </div>

  <style>{`
    .footer-section {
      background: linear-gradient(135deg, var(--primary-color), #0f172a);
      transition: background 0.5s ease;
    }
  `}</style>
</footer>


  );
};

export default Footer;
