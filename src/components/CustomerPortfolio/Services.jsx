import React, { useEffect, useState } from 'react';
import AddServices from './AddServices';
import { useDispatch } from 'react-redux';
import { useDeletePortfolioItem } from '../../hooks/usePortfolio';
import { showToast } from '../../redux/slice/ToastSlice';

function Services({ servicesData, pid }) {
    const [addService, setAddService] = useState(false);
    const [services, setServices] = useState([]);

    const dispatch = useDispatch();

    const deleteService = useDeletePortfolioItem();

    
    useEffect(() => {
        setServices(servicesData)

    }, [servicesData])

    const handleDeleteService = (id) => {
        deleteService.mutate({ portfolioId: pid, itemId: id, type: "services" }, {
            onSuccess: (data) => {
                setServices(data?.data?.services)
                dispatch(showToast({ message: 'Service Deleted Successfully' }))
            },
            onError: (error) => dispatch(showToast({ message: error, type: 'error' }))
        })
    }

    return (
        <div className={`w-9/12 mx-auto place-items-center p-4 rounded my-5 border bg-] relative `}>
            <h2 className="text-2xl font-semibold mb-4">Services</h2>
            {addService && <AddServices setAddService={setAddService} pid={pid} onServiceAdded={(newServices) => setServices(newServices)} />}

            {services && services.length === 0 ? (
                <div className="text-center">
                    <p className="text-gray-700 mb-4">No services available.</p>
                    <button
                        onClick={() => setAddService(!addService)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded"
                    >
                        Add Service
                    </button>
                </div>
            ) : (
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border border-gray-300">
                        <thead>
                            <tr className="bg-purple-200">
                                <th className="py-2 px-4 border">Title</th>
                                <th className="py-2 px-4 border">Description</th>
                                <th className="py-2 px-4 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services?.map((service, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border">{service.title}</td>
                                    <td className="py-2 px-4 border">{service.description}</td>
                                    <td className="py-2 px-4 border">
                                        <button
                                            onClick={() => handleDeleteService(service._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='flex justify-end my-3'>
                        <button
                            onClick={() => setAddService(!addService)}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded"
                        >
                            Add Service
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Services;
