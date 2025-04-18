import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Clients = ({ clients }) => {
  const url = import.meta.env.VITE_IMG_URL;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="py-5 w-full" id="clients">
      <div className="container mx-auto">
        <h2 className="text-center text-3xl font-bold text-color mb-5">Our Clients</h2>
        <Slider {...settings}>
          {clients.map((client, index) => (
            <div key={index} className="px-2">
              <div className="border-0 h-full">
                <div className="flex items-center justify-center p-4">
                  <img
                    src={`${url}${client.logoUrl}`}
                    alt={client.name}
                    className="img-fluid  rounded"
                    style={{ maxHeight: '80px' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Clients;