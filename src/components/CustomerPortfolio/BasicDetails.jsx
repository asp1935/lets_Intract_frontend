import React, { useEffect, useRef, useState } from 'react'
import { useCreatePortfolio } from '../../hooks/usePortfolio';
import { useDispatch } from 'react-redux';
import { showToast } from '../../redux/slice/ToastSlice';

function BasicDetails({ customer, setSelectedCategory, setSelectedCustomer }) {

    const [customerData, setCustomerData] = useState({
        userId: '',
        name: "",
        companyUrl: "",
        ownerName: "",
        email: "",
        mobile: "",
        socialLinks: {
            whatsapp: '',
            instagram: '',
            facebook: ''
        },
        about: "",
        address: "",
        addressUrl: "",
        theme: "#3498db",
        profilePhoto: null
    });

    const fileInputRef = useRef(null)
    const dispatch = useDispatch();
    const addPortfolio = useCreatePortfolio();



    // useEffect(() => {
    //     if (customer) {
    //         setCustomerData({
    //             userId: customer._id,
    //             name: "",
    //             companyUrl: "",
    //             ownerName: customer.name,
    //             email: customer.email,
    //             mobile: customer.mobile,
    //             socialLinks: {
    //                 whatsapp: '',
    //                 instagram: '',
    //                 facebook: ''
    //             },
    //             about: "",
    //             address: "",
    //             addressUrl: "",
    //             theme: "#3498db",
    //             profilePhoto: null
    //         })
    //     }
    // }, [customer])

    useEffect(() => {
        if (customer) {
            setCustomerData({
                userId: customer._id || '',
                name: "",
                companyUrl: "",
                ownerName: customer.name || "",
                email: customer.email || "",
                mobile: customer.mobile || "",
                socialLinks: {
                    whatsapp: '',
                    instagram: '',
                    facebook: ''
                },
                about: "",
                address: "",
                addressUrl: "",
                theme: "#3498db",
                profilePhoto: null
            });
        } else {
            setCustomerData({
                userId: '',
                name: "",
                companyUrl: "",
                ownerName: "",
                email: "",
                mobile: "",
                socialLinks: {
                    whatsapp: '',
                    instagram: '',
                    facebook: ''
                },
                about: "",
                address: "",
                addressUrl: "",
                theme: "#3498db",
                profilePhoto: null
            });
        }
    }, [customer]);



    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (['whatsapp', 'instagram', 'facebook'].includes(name)) {
            setCustomerData((prevData) => ({
                ...prevData,
                socialLinks: {
                    ...prevData.socialLinks,
                    [name]: value
                }
            }));
        } else {
            setCustomerData((prevData) => ({
                ...prevData,
                [name]: files ? files[0] : value
            }));
        }
    };


    const validate = () => {
        let tempErrors = {};

        // Name validation
        if (!customerData.name.trim()) {
            tempErrors.name = "Organization Name is required";
        }
        if (!customerData.ownerName.trim()) {
            tempErrors.ownerName = "Owner Name is required";
        }

        // Email validation
        if (!customerData.email) {
            tempErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(customerData.email)) {
            tempErrors.email = "Email is not valid";
        }

        // mobile validation
        if (!customerData.mobile) {
            tempErrors.mobile = "Mobile number is required";
        } else if (!/^\d{10}$/.test(customerData.mobile)) {
            tempErrors.mobile = "Mobile number must be exactly 10 digits";
        }

        // Password validation
        if (!customerData.about) {
            tempErrors.about = "About Us is required";
        }

        // State validation
        if (!customerData.address) {
            tempErrors.address = "Address is required";
        }

        // District validation
        if (!customerData.theme) {
            tempErrors.theme = "Theme is required";
        }

        // Taluka validation
        if (!customerData.profilePhoto) {
            tempErrors.profilePhoto = "Profile Photo is required";
        }

        setErrors(tempErrors);

        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            addPortfolio.mutate(customerData, {
                onSuccess: () => {
                    setCustomerData({
                        userId: '',
                        name: "",
                        companyUrl: "",
                        ownerName: "",
                        email: "",
                        mobile: "",
                        socialLinks: {
                            whatsapp: '',
                            instagram: '',
                            facebook: ''
                        },
                        about: "",
                        address: "",
                        addressUrl: "",
                        theme: "#3498db",
                        profilePhoto: null
                    });
                    setSelectedCustomer(null);
                    setSelectedCategory('all');
                    fileInputRef.current.value = '';
                    dispatch(showToast({ message: "Basic Portfolio Created" }))

                },
                onError: (error) => dispatch(showToast({ message: error, type: 'error' }))
            })
        } else {
            return
        }

    }

    return (
        <div className='w-9/12 mx-auto mt-5 shadow-2xl p-5 rounded-2xl'>
            <h2 className="text-3xl font-bold mb-6 text-center text-[#640D5F]" style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}>Basic Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="text-[#640D5F] font-bold">Company Name :</label>
                <input type="text" name="name" placeholder="Company Name" value={customerData.name} onChange={handleChange} className="w-full rounded p-2 border border-[#640D5F]" />
                {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

                <label className="text-[#640D5F] font-bold">Campany URL :</label>
                <input type="text" name="companyUrl" placeholder="Company URL (if available)" value={customerData.companyUrl} onChange={handleChange} className="w-full rounded p-2 border border-[#640D5F]" />
                {/* {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>} */}

                <label className="text-[#640D5F] font-bold">Customer Name :</label>
                <input type="text" name="ownerName" placeholder="Cutomer Name" value={customerData.ownerName} onChange={handleChange} className="w-full rounded p-2 border border-[#640D5F]" />
                {errors.ownerName && <p className="text-red-400 text-sm">{errors.ownerName}</p>}


                <div className="flex items-center space-x-2">
                    <div className='flex-1/2'>
                        <label className="text-[#640D5F] font-bold"> Mobile No. :</label>

                        <input type="tel" name="mobile" placeholder="Mobile Number" value={customerData.mobile} onChange={handleChange} className="w-full rounded p-2 border border-[#640D5F]" />
                        {errors.mobile && <p className="text-red-400 text-sm">{errors.mobile}</p>}
                    </div>
                    <div className='flex-1/2'>
                        <label className="text-[#640D5F] font-bold">Email :</label>

                        <input type="email" name="email" placeholder="Email" value={customerData.email} onChange={handleChange} className="w-full rounded p-2 border  border-[#640D5F]" />
                        {errors.email && <p className="text-red-400 text-sm">{errors.email}asdsdsdd</p>}
                    </div>
                </div>
                <label className="text-[#640D5F] font-bold">Full Address:</label>

                <input type="text" name="address" placeholder="Address" value={customerData.address} onChange={handleChange} className="w-full rounded p-2 border border-[#640D5F]" />
                {errors.address && <p className="text-red-400 text-sm">{errors.address}</p>}

                <label className="text-[#640D5F] font-bold">Address URL:</label>
                <input type="text" name="addressUrl" placeholder="Address Map URL" value={customerData.addressUrl} onChange={handleChange} className="w-full rounded p-2 border border-[#640D5F]" />
                {/* {errors.address && <p className="text-red-400 text-sm">{errors.address}</p>} */}

                <div className='mt-3 flex  gap-1'>
                    <div>
                        <label className="text-[#640D5F] font-bold">Whatsapp :</label>
                        <input type="url" name="whatsapp" placeholder="Whtasapp URL" value={customerData.socialLinks.whatsapp} onChange={handleChange} className="w-full rounded p-2 border  border-[#640D5F]" />
                    </div>
                    <div>
                        <label className="text-[#640D5F] font-bold">Instagram :</label>
                        <input type="url" name="instagram" placeholder="Instagram URL" value={customerData.socialLinks.instagram} onChange={handleChange} className="w-full rounded p-2 border  border-[#640D5F]" />
                    </div>
                    <div>
                        <label className="text-[#640D5F] font-bold">Facebook :</label>
                        <input type="url" name="facebook" placeholder="Facebook URL" value={customerData.socialLinks.facebook} onChange={handleChange} className="w-full rounded p-2 border  border-[#640D5F]" />
                    </div>

                </div>
                <div className='mt-3'>
                    <label className="text-[#640D5F] font-bold">Select Default Theme :</label>
                    <div className='flex justify-evenly mt-2'>
                        <div><input type="radio" name="theme" value="#3498db" checked={customerData.theme === "#3498db"} onChange={handleChange} className='cursor-pointer' /> <span className='bg-[#3498db] ml-1 px-8 py-1 rounded'></span></div>
                        <div><input type="radio" name="theme" value="#2ecc71" checked={customerData.theme === "#2ecc71"} onChange={handleChange} className='cursor-pointer' /> <span className='bg-[#2ecc71] ml-1 px-8 py-1 rounded'></span></div>
                        <div><input type="radio" name="theme" value="#e74c3c" checked={customerData.theme === "#e74c3c"} onChange={handleChange} className='cursor-pointer' /> <span className='bg-[#e74c3c] ml-1 px-8 py-1 rounded'></span></div>
                        <div><input type="radio" name="theme" value="#f39c12" checked={customerData.theme === "#f39c12"} onChange={handleChange} className='cursor-pointer' /> <span className='bg-[#f39c12] ml-1 px-8 py-1 rounded'></span></div>
                        <div><input type="radio" name="theme" value="#9b59b6" checked={customerData.theme === "#9b59b6"} onChange={handleChange} className='cursor-pointer' /> <span className='bg-[#9b59b6] ml-1 px-8 py-1 rounded'></span></div>
                    </div>
                    {errors.theme && <p className="text-red-400 text-sm">{errors.theme}</p>}
                </div>
                <div className='mt-3'>
                    <label className="text-[#640D5F] font-bold">Select Profile Pic :</label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        name="profilePhoto"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full p-2 rounded-md border border-[#640D5F]"
                    />
                    {errors.profilePhoto && <p className="text-red-400 text-sm">{errors.profilePhoto}</p>}

                </div>
                <div className='mt-3'>
                    <label className="text-[#640D5F] font-bold">About Us :</label>
                    <textarea name='about' value={customerData.about} onChange={handleChange} rows={3} className='resize-none w-full rounded p-2 border border-[#640D5F]'></textarea>
                    {errors.about && <p className="text-red-400 text-sm">{errors.about}</p>}

                </div>

                <div className='flex justify-center'>
                    <button
                        type='submit'
                        className='w-5/12 mt-4 mx-auto bg-[#aa1ba3] hover:bg-[#640D5F] text-white font-bold py-1.5 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={addPortfolio.isPending}
                    >
                        {addPortfolio.isPending ? "Submitting" : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default BasicDetails
