import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useUpdatePortfolio } from '../../hooks/usePortfolio';
import { showToast } from '../../redux/slice/ToastSlice';

function UpdatePortfolio({ portfolioData, setPortfolioData }) {

    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const updateBasicDetails = useUpdatePortfolio();

    const url = import.meta.env.VITE_IMG_URL;

    useEffect(() => {
        if (portfolioData) {
            setFormData({
                userName: portfolioData.userName,
                name: portfolioData.name,
                ownerName: portfolioData.ownerName,
                email: portfolioData.email,
                mobile: portfolioData.mobile,
                about: portfolioData.about,
                address: portfolioData.address,
                theme: portfolioData.theme,
            })
        }
        else {
            setFormData({})
        }
    }, [portfolioData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
            updateBasicDetails.mutate({ portfolioId: portfolioData._id, updatedData: formData }, {
                onSuccess: () => {
                    setIsEditMode(false);
                    setPortfolioData(null);   
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


    return (
        <div className='w-full rounded-lg shadow-lg  p-3'>
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
                    <div className='w-40'>
                        <img
                            className='w-40 rounded-full'
                            src={portfolioData?.profilePhotoUrl ? `${url}${portfolioData.profilePhotoUrl}` : '../../assets/profile.jpg'}
                            alt="Profile"
                        />
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
                                <h4 className='text-lg'>{portfolioData?.userName}</h4>
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
                                <h4 className='text-lg'>{portfolioData?.name}</h4>
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
                                <h4 className='text-lg'>{portfolioData?.ownerName}</h4>
                            )}
                        </div>
                    </div>
                </div>

                <div className='w-9/12 flex justify-evenly mt-5'>
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
                            <p className='text-lg'>{portfolioData?.mobile}</p>
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
                            <p className='text-lg'>{portfolioData?.email}</p>
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
                            <p className='text-lg '>{portfolioData?.address}</p>
                        )}
                    </div>
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
                        <p className='text-center text-lg '>{portfolioData?.about}</p>
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
                        <button
                            type='button'
                            onClick={handleSave}
                            className='bg-green-500 text-white px-3 py-0.5 rounded hover:bg-green-600 shadow-md transition-transform transform hover:scale-105'
                        >
                            Save
                        </button>
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
            </div>
        </div>
    );
};

export default UpdatePortfolio
