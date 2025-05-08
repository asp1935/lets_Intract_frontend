import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useUpdatePortfolio, useUpdateProfilePhoto } from '../../hooks/usePortfolio';
import { showToast } from '../../redux/slice/ToastSlice';
import Services from './Services';
import { Briefcase, Images, UserPen, Users } from 'lucide-react';
import Clients from './Clients';
import Gallery from './Gallery';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

function UpdatePortfolio({ portfolioData, setPortfolioData }) {

    const [portfolio, setPortfolio] = useState(null)

    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const updateBasicDetails = useUpdatePortfolio();
    const updatePortfolioPhoto = useUpdateProfilePhoto();

    const [fileUploadOpen, setFileUploadOpen] = useState(false);

    const [newProfilePic, setNewProfilePic] = useState(null);



    const [activeSection, setActiveSection] = useState(null); // 'services' | 'clients' | 'gallery' | null


    const url = import.meta.env.VITE_IMG_URL;

    useEffect(() => {
        setPortfolio(portfolioData)
        setActiveSection(null)
    }, [portfolioData])

    useEffect(() => {
        if (portfolio) {
            setFormData({
                userName: portfolio.userName,
                name: portfolio.name,
                ownerName: portfolio.ownerName,
                email: portfolio.email,
                mobile: portfolio.mobile,
                socialLinks: {
                    whatsapp: portfolio?.socialLinks?.whatsapp,
                    instagram: portfolio?.socialLinks?.instagram,
                    facebook: portfolio?.socialLinks?.facebook
                },
                about: portfolio.about,
                address: portfolio.address,
                theme: portfolio.theme,
            })
        }
        else {
            setFormData({})
        }
    }, [portfolio]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (['whatsapp', 'instagram', 'facebook'].includes(name)) {
            setFormData((prevData) => ({
                ...prevData,
                socialLinks: {
                    ...prevData.socialLinks,
                    [name]: value
                }
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const validate = () => {
        let tempErrors = {};

        // Name validation
        if (!formData.userName.trim()) {
            tempErrors.userName = "User Name is required";
        }
        if (!formData.name.trim()) {
            tempErrors.name = "Organization Name is required";
        }
        if (!formData.ownerName.trim()) {
            tempErrors.ownerName = "Owner Name is required";
        }

        // Email validation
        if (!formData.email) {
            tempErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = "Email is not valid";
        }

        // mobile validation
        if (!formData.mobile) {
            tempErrors.mobile = "Mobile number is required";
        } else if (!/^\d{10}$/.test(formData.mobile)) {
            tempErrors.mobile = "Mobile number must be exactly 10 digits";
        }

        // Password validation
        if (!formData.about) {
            tempErrors.about = "About Us is required";
        }

        // State validation
        if (!formData.address) {
            tempErrors.address = "Address is required";
        }

        // District validation

        if (!formData.theme) {
            tempErrors.theme = "Theme is required";
        }
        setErrors(tempErrors);

        return Object.keys(tempErrors).length === 0;
    };

    const handleSave = () => {

        if (validate()) {
            updateBasicDetails.mutate({ portfolioId: portfolio._id, updatedData: formData }, {
                onSuccess: (data) => {

                    setIsEditMode(false);
                    // setPortfolioData(null);
                    setPortfolio(data?.data)
                    setFormData({})
                    dispatch(showToast({ message: "Basic Details Updated Successfully" }))
                },
                onError: (error) => dispatch(showToast({ message: error, type: 'error' }))

            })

        }
        else {
            return
        }
    };

    const handleCancle = () => {
        setIsEditMode(false);
        setFormData({})

    }


    const toggleSection = (section) => {
        setActiveSection(prev => (prev === section ? null : section));
    };

    const toggleFileUpload = () => {
        setFileUploadOpen(true);
    }

    const handleUpdatePhoto = () => {
        if (!newProfilePic || !newProfilePic.type.startsWith('image/')) {
            dispatch(showToast({ message: 'Profile Picture Is Required', type: 'error' }))
            return;
        }
        updatePortfolioPhoto.mutate({ portfolioId: portfolio._id, userId: portfolio.userId, profilePhoto: newProfilePic }, {
            onSuccess: (data) => {
                setFileUploadOpen(false);
                setNewProfilePic(null);
                if (data?.data) {
                    setPortfolio(data.data)
                }
                dispatch(showToast({ message: 'Profile Photo Updated' }))
            },
            onError: (error) => dispatch(showToast({ message: error, type: 'error' }))

        })
    }

    return (
        <div className='w-full rounded-lg shadow-lg  p-3 relative'>
            <div className='flex justify-end p-2.5'>
                <button
                    type='button'
                    className='cursor-pointer bg-white text-black shadow border px-2 rounded'
                    title='Close'
                    onClick={() => setPortfolioData(null)}
                >
                    Close
                </button>
            </div>

            <div className='w-9/12 mx-auto place-items-center p-2 rounded my-5 border bg-[#f8e1f6]'>
                <div className='w-8/12 flex justify-evenly items-center'>
                    <div className='w-40 relative'>
                        <img
                            className='w-40 h-40 rounded-full'
                            src={portfolio?.profilePhotoUrl ? `${url}${portfolio.profilePhotoUrl}` : '../../assets/profile.jpg'}
                            alt="Profile"
                        />
                        <UserPen className='absolute bottom-0 left-1/2 transform -translate-x-1/2  cursor-pointer  text-black hover:scale-105 '
                            onClick={toggleFileUpload} />
                    </div>

                    <div className='flex flex-col gap-y-1.5'>
                        <div className='flex gap-3'>
                            <label className='text-gray-600 font-semibold'>Username:</label>
                            {isEditMode ? (
                                <>
                                    <input
                                        type="text"
                                        name="userName"
                                        value={formData.userName || ''}
                                        onChange={handleInputChange}
                                        className="border px-2 py-1 rounded"
                                    />
                                    {errors.userName && <p className="text-red-400 text-sm">{errors.userName}</p>}
                                </>
                            ) : (
                                <h4 className='text-lg'>{portfolio?.userName}</h4>
                            )}
                        </div>

                        <div className='flex gap-3'>
                            <label className='text-gray-600 font-semibold'>Company:</label>
                            {isEditMode ? (
                                <>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleInputChange}
                                        className="border px-2 py-1 rounded"
                                    />
                                    {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
                                </>
                            ) : (
                                <h4 className='text-lg'>{portfolio?.name}</h4>
                            )}
                        </div>

                        <div className='flex gap-3'>
                            <label className='text-gray-600 font-semibold'>Name:</label>
                            {isEditMode ? (
                                <>
                                    <input
                                        type="text"
                                        name="ownerName"
                                        value={formData.ownerName || ''}
                                        onChange={handleInputChange}
                                        className="border px-2 py-1 rounded"
                                    />
                                    {errors.ownerName && <p className="text-red-400 text-sm">{errors.ownerName}</p>}

                                </>
                            ) : (
                                <h4 className='text-lg'>{portfolio?.ownerName}</h4>
                            )}
                        </div>
                    </div>
                </div>

                <div className='w-10/12 flex justify-evenly gap-x-3 mt-5 '>
                    <div>
                        <label className='inline-block w-full text-center text-sm text-gray-600 font-semibold'>Mobile</label>
                        {isEditMode ? (
                            <>
                                <input
                                    type="text"
                                    name="mobile"
                                    value={formData.mobile || ''}
                                    onChange={handleInputChange}
                                    className="border px-2 py-1 rounded"
                                />
                                {errors.mobile && <p className="text-red-400 text-sm">{errors.mobile}</p>}
                            </>
                        ) : (
                            <p className='text-lg'>{portfolio?.mobile}</p>
                        )}
                    </div>

                    <div>
                        <label className='inline-block w-full text-center text-sm text-gray-600 font-semibold'>Email</label>
                        {isEditMode ? (
                            <>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleInputChange}
                                    className="border px-2 py-1 rounded"
                                />
                                {errors.email && <p className="text-red-400 text-sm">{errors.email}asdsdsdd</p>}

                            </>
                        ) : (
                            <p className='text-lg'>{portfolio?.email}</p>
                        )}
                    </div>

                    <div>
                        <label className='inline-block w-full text-center text-sm text-gray-600 font-semibold'>Address</label>
                        {isEditMode ? (
                            <>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address || ''}
                                    onChange={handleInputChange}
                                    className="border px-2 py-1 rounded"
                                />
                                {errors.address && <p className="text-red-400 text-sm">{errors.address}</p>}

                            </>
                        ) : (
                            <p className='text-lg '>{portfolio?.address}</p>
                        )}
                    </div>
                </div>

                <div className='w-10/12 my-5'>
                    <h5 className='text-center text-gray-500 font-semibold'>Social Media</h5>
                    {isEditMode ? (
                        <div className='mt-2 flex  gap-3'>
                            <div>
                                <label className="text-[#640D5F] font-bold">Whatsapp :</label>
                                <input type="url" name="whatsapp" placeholder="Whtasapp URL" value={formData?.socialLinks?.whatsapp} onChange={handleInputChange} className="w-full rounded p-2 border  border-[#640D5F]" />
                            </div>
                            <div>
                                <label className="text-[#640D5F] font-bold">Instagram :</label>
                                <input type="url" name="instagram" placeholder="Instagram URL" value={formData?.socialLinks?.instagram} onChange={handleInputChange} className="w-full rounded p-2 border  border-[#640D5F]" />
                            </div>
                            <div>
                                <label className="text-[#640D5F] font-bold">Facebook :</label>
                                <input type="url" name="facebook" placeholder="Facebook URL" value={formData?.socialLinks?.facebook} onChange={handleInputChange} className="w-full rounded p-2 border  border-[#640D5F]" />
                            </div>

                        </div>
                    ) : (
                        <div className=' flex justify-evenly mt-2 text-3xl '>
                            <FaWhatsapp className='text-lime-500  cursor-pointer' onClick={() => window.open(portfolio?.socialLinks?.whatsapp)} />
                            <FaInstagram className='text-pink-600 cursor-pointer' onClick={() => window.open(portfolio?.socialLinks?.instagram)} />
                            <FaFacebook className='text-blue-600 cursor-pointer' onClick={() => window.open(portfolio?.socialLinks?.facebook)} />
                        </div>
                    )}

                </div>

                <div className='w-9/12 my-5'>
                    <h5 className='text-center text-gray-500 font-semibold'>About</h5>
                    {isEditMode ? (
                        <>
                            <textarea
                                name="about"
                                value={formData.about || ''}
                                onChange={handleInputChange}
                                className="w-full border px-3 py-2 rounded resize-none"
                                rows={3}
                            />
                            {errors.about && <p className="text-red-400 text-sm">{errors.about}</p>}

                        </>
                    ) : (
                        <p className='text-center text-lg '>{portfolio?.about}</p>
                    )}
                </div>
                <div className='w-9/12 my-5'>

                    {isEditMode && (
                        <div className='mt-3'>
                            <label className="text-[#640D5F] font-bold">Select Default Theme :</label>
                            <div className='flex justify-evenly mt-2'>
                                <div><input type="radio" name="theme" value="#3498db" checked={formData?.theme === "#3498db"} onChange={handleInputChange} className='cursor-pointer' /> <span className='bg-[#3498db] ml-1 px-8 py-1 rounded'></span></div>
                                <div><input type="radio" name="theme" value="#2ecc71" checked={formData?.theme === "#2ecc71"} onChange={handleInputChange} className='cursor-pointer' /> <span className='bg-[#2ecc71] ml-1 px-8 py-1 rounded'></span></div>
                                <div><input type="radio" name="theme" value="#e74c3c" checked={formData?.theme === "#e74c3c"} onChange={handleInputChange} className='cursor-pointer' /> <span className='bg-[#e74c3c] ml-1 px-8 py-1 rounded'></span></div>
                                <div><input type="radio" name="theme" value="#f39c12" checked={formData?.theme === "#f39c12"} onChange={handleInputChange} className='cursor-pointer' /> <span className='bg-[#f39c12] ml-1 px-8 py-1 rounded'></span></div>
                                <div><input type="radio" name="theme" value="#9b59b6" checked={formData?.theme === "#9b59b6"} onChange={handleInputChange} className='cursor-pointer' /> <span className='bg-[#9b59b6] ml-1 px-8 py-1 rounded'></span></div>
                            </div>
                            {errors.theme && <p className="text-red-400 text-sm">{errors.theme}</p>}

                        </div>
                    )
                    }
                </div>

                <div className='justify-self-end p-2.5'>
                    {isEditMode ? (
                        <div className='space-x-2'>
                            <button
                                type='button'
                                onClick={handleCancle}
                                className='bg-red-500 text-white px-3 py-0.5 rounded hover:bg-red-600 shadow-md transition-transform transform hover:scale-105'
                            >
                                Cancel
                            </button>
                            <button
                                type='button'
                                onClick={handleSave}
                                className='bg-green-500 text-white px-3 py-0.5 rounded hover:bg-green-600 shadow-md transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
                                disabled={updateBasicDetails.isPending}
                            >
                                {updateBasicDetails.isPending ? "Saving..." : "Save"}
                            </button>
                        </div>
                    ) : (
                        <button
                            type='button'
                            onClick={() => setIsEditMode(true)}
                            className='bg-blue-500 text-white px-3 py-0.5 rounded hover:bg-blue-600 shadow-md transition-transform transform hover:scale-105'
                        >
                            Edit
                        </button>
                    )}
                </div>
                <div className='space-x-3 text-white'>
                    <button className='bg-rose-600 hover:bg-rose-700  px-3 py-1 rounded' onClick={() => toggleSection('services')} >Services <Briefcase className='inline-block' /> </button>
                    <button className='bg-rose-600 hover:bg-rose-700  px-3 py-1 rounded' onClick={() => toggleSection('clients')} >Clients <Users className='inline-block' /></button>
                    <button className='bg-rose-600 hover:bg-rose-700  px-3 py-1 rounded' onClick={() => toggleSection('gallery')} >Gallery <Images className='inline-block' /></button>
                </div>
            </div>
            <div>
                {activeSection === 'services' && <Services servicesData={portfolio?.services} pid={portfolio?._id} />}
                {activeSection === 'clients' && <Clients clientsData={portfolio?.clients} uid={portfolio?.userId} pid={portfolio?._id} />}
                {activeSection === 'gallery' && <Gallery galleryData={portfolio?.gallery} uid={portfolio?.userId} pid={portfolio?._id} />}

            </div>
            {/* Delete Confirmation Modal */}
            {
                fileUploadOpen && (
                    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full h-full flex items-center justify-center bg-black/40">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center border border-gray-300">
                            <h2 className="text-xl font-bold mb-4">Update Profile Picture</h2>
                            <div className='flex flex-col'>
                                {/* <label htmlFor={`profile`}>Logo</label> */}
                                <input
                                    type="file"
                                    name="images"
                                    id={`profile`}
                                    // value={client.title}
                                    accept=".png, .jpg, .jpeg"
                                    onChange={(e) => setNewProfilePic(e.target.files[0])}
                                    className='border p-1 rounded'
                                    required
                                />
                            </div>
                            <button
                                onClick={handleUpdatePhoto}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={updatePortfolioPhoto.isPending}
                            >
                                {updatePortfolioPhoto.isPending ? "Updating..." : "Confirm"}
                            </button>
                            <button
                                onClick={() => { setFileUploadOpen(false); setNewProfilePic(null) }}
                                className="bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded hover:bg-gray-400 transition ml-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default UpdatePortfolio
