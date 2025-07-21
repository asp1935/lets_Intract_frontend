import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Clients = ({ clients }) => {
  const url = import.meta.env.VITE_IMG_URL;


  // Compute per breakpoint
  const desktopSlides = Math.min(5, clients.length);
  const tabletSlides = Math.min(3, clients.length);
  const mobileSlides = Math.min(3, clients.length);

  // Should infinite autoplay run?
  const infinite = clients.length > desktopSlides;
  const autoplay = clients.length > desktopSlides;

  const settings = {
    dots: true,
    infinite: infinite,
    speed: 500,
    slidesToShow: desktopSlides,
    slidesToScroll: 1,
    autoplay: autoplay,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: tabletSlides,
          infinite: clients.length > tabletSlides,
          autoplay: clients.length > tabletSlides,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: tabletSlides,
          infinite: clients.length > tabletSlides,
          autoplay: clients.length > tabletSlides,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: mobileSlides,
          infinite: clients.length > mobileSlides,
          autoplay: clients.length > mobileSlides,
        },
      },
    ],
  };

  return (
    <section className="py-5" id="clients">
      <div className="container mx-auto">
        <h2 className="text-4xl font-extrabold text-color mb-4 text-center ">
          Our Clients
        </h2>
        <Slider {...settings}>
          {clients.map((client, index) => (
            <div key={index} className="px-2">
              <div className="border-0 h-full">
                <div className="flex items-center justify-center p-4">
                  <img
                    src={`${url}${client.logoUrl}`}
                    alt={client.name}
                    className="img-fluid rounded"
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
