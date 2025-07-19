// import React from 'react';
// import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

// const About = ({ businessInfo }) => {
//   return (
//     <section className="py-5 px-2 bg-light w-full" id="about">
//       <div className="container mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//           {/* About Content Column */}
//           <div>
//             <div className="px-4 md:px-6">
//               <h2 className="text-3xl text-center text-color font-bold mb-4">About Us</h2>
//               <p className="text-lg text-gray-700 mb-0 text-justify">{businessInfo.about}</p>
//             </div>
//           </div>

//           {/* Contact Card Column */}
//           <div>
//             <div className="bg-white rounded-lg h-full mx-1 p-4 md:p-6" style={{
//               boxShadow: "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px"
//             }}>
//               <h2 className="text-3xl text-color text-center font-bold mb-4">Contact Details</h2>
//               <ul className="list-none mb-0">

//                 {/* Email */}
//                 <li className="mb-4 pb-2 border-b">
//                   <div className="flex items-start">
//                     <div className="icon-bg flex items-center justify-center rounded-full w-10 h-10 min-w-[2.5rem]">
//                       <FaEnvelope className="text-white text-base" />
//                     </div>
//                     <div className="ml-3">
//                       <p className="text-sm font-bold text-gray-800">Email</p>
//                       <a href={`mailto:${businessInfo.email}`} className="text-gray-800 no-underline">
//                         {businessInfo.email}
//                       </a>
//                     </div>
//                   </div>
//                 </li>

//                 {/* Phone */}
//                 <li className="mb-4 pb-2 border-b">
//                   <div className="flex items-start">
//                     <div className="icon-bg flex items-center justify-center rounded-full w-10 h-10 min-w-[2.5rem]">
//                       <FaPhone className="text-white text-base" />
//                     </div>
//                     <div className="ml-3">
//                       <p className="text-sm font-bold text-gray-800">Phone</p>
//                       <a href={`tel:${String(businessInfo.mobile).replace(/\D/g, '')}`} className="text-gray-800 no-underline">
//                         {businessInfo.mobile}
//                       </a>
//                     </div>
//                   </div>
//                 </li>

//                 {/* Address */}
//                 <li>
//                   <div className="flex items-start">
//                     <div className="icon-bg flex items-center justify-center rounded-full w-10 h-10 min-w-[2.5rem]">
//                       <FaMapMarkerAlt className="text-white text-base" />
//                     </div>
//                     <div className="ml-3">
//                       <p className="text-sm font-bold text-gray-800">Address</p>
//                       <p className="text-gray-800">{businessInfo.address}</p>
//                     </div>
//                   </div>
//                 </li>
//               </ul>
//             </div>
//           </div>

//         </div>
//       </div>

//       <style jsx>{`
//         .text-color {
//            --primary-bg: linear-gradient(135deg, var(--primary-color) 0%, #1a3a8f 100%);
//           background: var(--primary-bg);
//           -webkit-background-clip: text;
//           background-clip: text;
//           color: transparent;
//         }

//         .icon-bg {
//             --primary-bg: linear-gradient(135deg, var(--primary-color) 0%, #1a3a8f 100%);
//             background: var(--primary-bg);
//             width: 2.5rem;
//             height: 2.5rem;
//         }
//         `}
//         </style>
//     </section>
//   );
// };

// export default About;


import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const About = ({ businessInfo }) => {
  return (
    <section className="py-10 bg-gradient-to-br from-white via-gray-50 to-gray-100" id="about">
      <div className="container mx-auto ">
        <div className="justify-items-center">

          {/* About Content */}
          <div className="bg-white/90 backdrop-blur-lg rounded-xl p-6 shadow-lg h-full w-11/12 sm:w-2/3 ">
            <h2 className="text-4xl font-extrabold text-color mb-4 text-center ">
              About Us
            </h2>
            <div className="text-lg text-gray-700 leading-relaxed text-justify p-3.5" dangerouslySetInnerHTML={{ __html: businessInfo.about }}>
              {/* {businessInfo.about} */}
            </div>
          </div>

          {/* Contact Card */}

        </div>
      </div>

      <style >{`
        .text-color {
          --primary-bg: linear-gradient(135deg, var(--primary-color), #1a3a8f);
          background: var(--primary-bg);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .icon-bg {
          background: linear-gradient(135deg, var(--primary-color), #1a3a8f);
          width: 2.5rem;
          height: 2.5rem;
          min-width: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </section>
  );
};

export default About;
