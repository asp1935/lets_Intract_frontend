import React from 'react';
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';

const Hero = ({ businessInfo }) => {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const url = import.meta.env.VITE_IMG_URL;

  return (
    <section className="hero-section w-full">
      <div className="hero-container">
        <div className="hero-content-wrapper">
          {/* Image Column */}
          <div className="hero-image-container">
            <div className="hero-image-wrapper">
              <img
                src={`${url}${businessInfo.profilePhotoUrl}`}
                alt={businessInfo.ownerName}
                className="hero-profile-img"
              />
              <div className="hero-image-overlay"></div>
            </div>
          </div>

          {/* Content Column */}
          <div className="hero-text-container">
            <h1 className="hero-title">
              {businessInfo.ownerName}
            </h1>
            <p className="hero-subtitle">
              {businessInfo.name}
            </p>
            <p className="hero-description">
              Professional business solutions tailored to your needs
            </p>
            <div className="hero-actions">
              <button className="hero-primary-btn" onClick={scrollToAbout}>
                <i className="bi bi-envelope-fill mr-2"></i> Contact Me
              </button>
              <button className="hero-secondary-btn" onClick={scrollToServices}>
                <i className="bi bi-briefcase-fill mr-2"></i> Our Services
              </button>
            </div>
            <div className="hero-social-links">
              {[
                { icon: <FaWhatsapp  className='text-[2.5rem]'/>, name: 'WhatsApp', url: businessInfo?.socialLinks?.whatsapp   }, // Replace 'your-number' with your WhatsApp number
                { icon: <FaFacebook className='text-[2.5rem]'/>, name: 'Facebook', url: businessInfo?.socialLinks?.facebook }, // Replace with your Facebook page URL
                { icon: <FaInstagram className='text-[2.5rem]'/>, name: 'Instagram', url: businessInfo?.socialLinks?.instagram  } // Replace with your Instagram profile URL
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank" // Opens the link in a new tab
                  rel="noopener noreferrer" // Security best practice
                  className="social-icon ml-2.5"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS-in-JS for dynamic styling */}
      <style jsx>{`
        .hero-section {
          --primary-bg: linear-gradient(135deg, var(--primary-color) 0%, #1a3a8f 100%);
          --btn-hover-darken: 15%;
          position: relative;
          background: var(--primary-bg);
          color: white;
          overflow: hidden;
          padding: 2rem 0;
        }
        
        .hero-section::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: rotate 20s linear infinite;
          z-index: 0;
        }
        
        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          position: relative;
          z-index: 1;
        }
        
        .hero-content-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }
        
        @media (min-width: 992px) {
          .hero-content-wrapper {
            flex-direction: row;
            justify-content: center;
            gap: 3rem;
          }
        }
        
        /* Image styling */
        .hero-image-container {
          flex: 0 0 auto;
        }
        
        .hero-image-wrapper {
          display: inline-block;
          position: relative;
        }
        
        .hero-profile-img {
          width: 200px;
          height: 200px;
          object-fit: cover;
          border-radius: 50%;
          border: 5px solid rgba(255,255,255,0.3);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .hero-image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 4px solid rgba(255,255,255,0.1);
          pointer-events: none;
        }
        
        .hero-profile-img:hover {
          transform: scale(1.05) rotate(2deg);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }
        
        /* Text content styling */
        .hero-text-container {
          text-align: center;
          max-width: 600px;
        }
        
        @media (min-width: 992px) {
          .hero-text-container {
            text-align: left;
            flex: 1 1 auto;
          }
        }
        
        .hero-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          position: relative;
          background: linear-gradient(to right, #ffffff, #e6f0ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .hero-subtitle {
          font-size: 1.25rem;
          color: rgba(255,255,255,0.9);
          margin-bottom: 1rem;
        }
        
        .hero-description {
          color: rgba(255,255,255,0.75);
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }
        
        /* Buttons styling */
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        
        @media (min-width: 992px) {
          .hero-actions {
            justify-content: flex-start;
          }
        }
        
        .hero-primary-btn, .hero-secondary-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          font-weight: bold;
          font-size: 1rem;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          border: none;
          cursor: pointer;
        }
        
        .hero-primary-btn {
          background: var(--primary-bg);
          color: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .hero-primary-btn:hover {
          filter: brightness(0.85);
          transform: translateY(-3px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
        }
        
        .hero-secondary-btn {
          background: transparent;
          color: white;
          border: 2px solid rgba(255,255,255,0.5);
        }
        
        .hero-secondary-btn:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-3px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        
        /* Social icons */
        .hero-social-links {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        
        .hero-social-links .social-icon{
          color:#FFB200;
}


        @media (min-width: 992px) {
          .hero-social-links {
            justify-content: flex-start;
          }
        }
        
        .social-icon {
          color: rgba(255,255,255,0.75);
          font-size: 1.25rem;
          transition: all 0.3s ease;
        }
        
        .social-icon:hover {
          color: white;
          transform: translateY(-2px);
        }
        
        /* Animation */
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Responsive adjustments */
        @media (min-width: 768px) {
          .hero-profile-img {
            width: 220px;
            height: 220px;
          }
          
          .hero-title {
            font-size: 3rem;
          }
        }
        
        @media (min-width: 1200px) {
          .hero-profile-img {
            width: 250px;
            height: 250px;
          }
        }
        
        @media (max-width: 575.98px) {
          .hero-profile-img {
            width: 180px;
            height: 180px;
          }
          
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-actions {
            flex-direction: column;
            width: 100%;
          }
          
          .hero-primary-btn, .hero-secondary-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;