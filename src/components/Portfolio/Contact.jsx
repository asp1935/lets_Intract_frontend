import React from 'react'
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa'

function Contact({ businessInfo }) {
    return (
        <section className="pt-5 pb-10 bg-gradient-to-br from-white via-gray-50 to-gray-100 box-border justify-items-center" id="contact">
            <div className="container justify-items-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-color mb-4 text-center ">
                    Contact Us
                </h2>
                <div className={`flex flex-col sm:flex-row items-center justify-center gap-2 ${businessInfo.addressUrl ? 'w-[95%] sm:w-10/12 md:w-11/12 h-[500px] md:h-[400px]' : 'w-[95%] sm:w-10/12 md:w-3/5 h-[300px] md:h-[400px]'}`}>
                    {/* Content */}
                    <div className="bg-white/90 backdrop-blur-lg rounded-xl p-2 sm:p-4 md:p-6 shadow-lg h-full w-full">
                        <ul className="list-none mb-0 h-full flex flex-col justify-evenly">

                            {/* Email */}
                            <li className="mb-4 pb-2 border-b">
                                <div className="flex items-start">
                                    <div className="icon-bg flex items-center justify-center rounded-full w-10 h-10 min-w-[2.5rem]">
                                        <FaEnvelope className="text-white text-base" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-bold text-gray-800">Email</p>
                                        <a href={`mailto:${businessInfo.email}`} className="text-gray-800 no-underline">
                                            {businessInfo.email}
                                        </a>
                                    </div>
                                </div>
                            </li>

                            {/* Phone */}
                            <li className="mb-4 pb-2 border-b">
                                <div className="flex items-start">
                                    <div className="icon-bg flex items-center justify-center rounded-full w-10 h-10 min-w-[2.5rem]">
                                        <FaPhone className="text-white text-base" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-bold text-gray-800">Phone</p>
                                        <a href={`tel:${String(businessInfo.mobile).replace(/\D/g, '')}`} className="text-gray-800 no-underline">
                                            {businessInfo.mobile}
                                        </a>
                                    </div>
                                </div>
                            </li>

                            {/* Address */}
                            <li className='pb-2 border-b'>
                                <div className="flex items-start">
                                    <div className="icon-bg flex items-center justify-center rounded-full w-10 h-10 min-w-[2.5rem]">
                                        <FaMapMarkerAlt className="text-white text-base" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-bold text-gray-800">Address</p>
                                        <p className="text-gray-800">{businessInfo.address}</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    {businessInfo.addressUrl && (<div className='bg-white/90 backdrop-blur-lg rounded-xl p-2 shadow-sm w-full h-full'>
                        <iframe
                            src={businessInfo.addressUrl}
                            className='w-full h-full'
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>)}
                </div>
            </div>
        </section>
    )
}

export default Contact
