import React from 'react';
import { FaWhatsapp, FaFacebook, FaInstagram, FaLink } from 'react-icons/fa';

const Hero = ({ businessInfo }) => {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('contact');
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
              <div className="hero-image-decoration"></div>

            </div>
          </div>

          {/* Content Column */}
          <div className="hero-text-container">
            <div className="hero-tag">Professional Services</div>
            <h1 className="hero-title">
              {businessInfo.ownerName}
            </h1>
            <p className="hero-subtitle">
              {businessInfo.name}
              {businessInfo.companyUrl && (

                <a
                  href={businessInfo.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center ml-2 text-white hover:text-yellow-400 transition-colors"
                >

                  <FaLink className="ml-1 text-lg" />

                </a>
              )}
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
                { icon: <FaWhatsapp className='text-[1.5rem]' />, name: 'WhatsApp', url: businessInfo?.socialLinks?.whatsapp },
                { icon: <FaFacebook className='text-[1.5rem]' />, name: 'Facebook', url: businessInfo?.socialLinks?.facebook },
                { icon: <FaInstagram className='text-[1.5rem]' />, name: 'Instagram', url: businessInfo?.socialLinks?.instagram }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label={social.name}
                >
                  <div className="social-icon-container">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS-in-JS for dynamic styling */}
      <style >{`
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
          z-index: 1;

        }
        
        .hero-profile-img {
          width: 220px;
          height: 220px;
          object-fit: cover;
          border-radius: 50%;
          border: 5px solid rgba(255,255,255,0.3);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;

          z-index: 2;

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
                 .hero-image-overlay {
          position: absolute;
          top: -10px;
          left: -10px;
          width: calc(100% + 20px);
          height: calc(100% + 20px);
          border-radius: 50%; /* Matching perfect circle */
          border: 2px solid rgba(255,255,255,0.2);
          pointer-events: none;
          z-index: 1;
          animation: pulse 6s infinite ease-in-out;
        }
           .hero-image-decoration {
          position: absolute;
          top: -20px;
          left: -20px;
          width: calc(100% + 40px);
          height: calc(100% + 40px);
          background: linear-gradient(45deg, transparent 50%, rgba(255,255,255,0.03) 100%);
          border-radius: 50%; /* Matching perfect circle */
          z-index: 0;
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
             .hero-tag {
          display: inline-block;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          padding: 0.5rem 1.25rem;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 1px;
          margin-bottom: 1rem;
          text-transform: uppercase;
          color: rgba(255,255,255,0.9);
        }
        
        // .hero-title {
        //   font-size: 2.5rem;
        //   font-weight: bold;
        //   margin-bottom: 0.5rem;
        //   position: relative;
        //   background: linear-gradient(to right, #ffffff, #e6f0ff);
        //   -webkit-background-clip: text;
        //   background-clip: text;
        //   color: transparent;
        //   text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        // }
            .hero-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
          line-height: 1.2;
          background: linear-gradient(to right, #ffffff, #e6f0ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .hero-subtitle {
          font-size: 1.5rem;
          color: rgba(255,255,255,0.9);
          margin-bottom: 1rem;
          font-weight: 400;

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
        
        .social-icons {
          color: rgba(255,255,255,0.75);
          font-size: 1.25rem;
          transition: all 0.3s ease;
        }
                
        .social-icon-container {
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(5px);
          border-radius: 50%;
          color: white;
          font-size: 1.25rem;
          transition: all 0.4s ease;
          border: 1px solid rgba(255,255,255,0.2);
        }
        
        // .social-icon:hover {
        //   color: white;
        //   transform: translateY(-2px);
        // }
          .social-icon:hover .social-icon-container {
          background: rgba(255,255,255,0.2);
          transform: translateY(-5px) scale(1.1);
          color: #FFB200;
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
          border-color: rgba(255,255,255,0.3);
        }
        
        /* Animation */
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
             /* Animations */
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 0.5; }
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