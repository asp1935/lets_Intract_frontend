import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { showToast } from '../../redux/slice/ToastSlice';
import { useAddServices } from '../../hooks/usePortfolio';

function AddServices({ setAddService, pid, onServiceAdded  }) {
    const [services, setServices] = useState([
        { title: '', description: '' }
    ]);

    const dispatch = useDispatch();
    const addServices = useAddServices();


    // Handle input change for a specific service
    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedServices = [...services];
        updatedServices[index][name] = value;
        setServices(updatedServices);
    };

    // Add a new blank service (max 5 allowed)
    const addNewService = () => {
        if (services.length < 5) {
            setServices([...services, { title: '', description: '' }]);
        }
    };

    // Delete a specific service
    const removeService = (index) => {
        const updatedServices = services.filter((_, i) => i !== index);
        setServices(updatedServices);
    };

    const validate = () => {
        for (let service of services) {
            if (service.title.trim() === '' || service.description.trim() === '') {
                dispatch(showToast({ message: 'All Service Fields are Required', type: 'warn' }));
                return false;
            }
        }
        return true;
    };



    const handleSubmitServices = () => {
        if (validate()) {
            addServices.mutate({ portfolioId: pid, services }, {
                onSuccess: (data) => {
                    setAddService(false);
                    onServiceAdded(data?.data?.services)
                    dispatch(showToast({ message: 'Services Added Successfully' }))
                },
                onError: (error) => dispatch(showToast({ message: error, type: 'error' }))
            })
        }
    }

    return (
        <div className='w-full my-5  bg-white shadow-xl rounded-xl border overflow-clip'>
            <div className='flex justify-between p-2 bg-[#fb52c3] '>
                <h3 className='mx-3 text-xl font-semibold'>Add Services</h3>
                <button className='cursor-pointer outline-0' onClick={() => setAddService(false)}><X /></button>
            </div>

            <div className='w-10/12 mx-auto'>
                <div className='p-5 space-y-6'>
                    {services.map((service, index) => (
                        <div key={index} className='relative border p-4 rounded space-y-4 shadow'>
                            {services.length > 1 && (
                                <button
                                    onClick={() => removeService(index)}
                                    className='absolute top-2 right-2 text-gray-500 hover:text-red-600'
                                >
                                    <X size={18} />
                                </button>
                            )}
                            <div className='flex flex-col'>
                                <label htmlFor={`title-${index}`}>Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    id={`title-${index}`}
                                    placeholder='Service Title'
                                    value={service.title}
                                    onChange={(e) => handleChange(index, e)}
                                    className='border p-1 rounded'
                                    required
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor={`description-${index}`}>Description</label>
                                <textarea
                                    rows={2}
                                    name="description"
                                    id={`description-${index}`}
                                    placeholder='Service Description'
                                    value={service.description}
                                    onChange={(e) => handleChange(index, e)}
                                    className='resize-none border p-1 rounded'
                                    required
                                />
                            </div>
                        </div>
                    ))}

                    {services.length < 5 && (
                        <button
                            onClick={addNewService}
                            className='border px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 focus:scale-95 text-white'
                        >
                            + Add Another Service
                        </button>
                    )}
                </div>
            </div>

            <div className='flex gap-3 justify-end p-3'>
                <button className='border px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white' onClick={() => setAddService(false)}>Cancel</button>
                <button className='border px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white font-sembold' onClick={handleSubmitServices}>Save</button>
            </div>
        </div>
    );
}

export default AddServices;
