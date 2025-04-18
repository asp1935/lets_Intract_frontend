import React from 'react';

const Services = ({ services }) => {
  return (
    <section className="py-5 bg-gray-100 w-full" id="services">
      <div className="container mx-auto">
        <div className="text-center mb-5 animate-fade-in">
          <h2 className="font-bold text-3xl mb-3 text-color">Our Services</h2>
          <p className="text-lg text-gray-600">We offer comprehensive solutions to grow your business</p>
          <div className="divider mx-auto my-1 icon-bg" style={{ width: '80px', height: '8px' }}></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="animate-card" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card h-full shadow-sm mx-1 border border-blue-600 hover-effect">
                <div className="card-body text-center p-4 flex flex-col">
                  <h3 className="text-lg font-bold text-color">{service.title}</h3>
                  <p className="text-gray-600 flex-grow">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-card {
          animation: slideUp 0.5s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .hover-effect {
          transition: all 0.3s ease;
          border-radius: 10px;
        }
        .hover-effect:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </section>
  );
};

export default Services;