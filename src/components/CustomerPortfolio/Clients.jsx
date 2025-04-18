import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useDeletePortfolioItem } from '../../hooks/usePortfolio';
import { showToast } from '../../redux/slice/ToastSlice';
import AddClients from './AddClients';

function Clients({uid, pid, clientsData }) {
    const [addClients, setAddClients] = useState(false);
    const [clients, setClients] = useState([]);
    const url = import.meta.env.VITE_IMG_URL;


    const dispatch = useDispatch();

    const deleteClient = useDeletePortfolioItem();

    useEffect(() => {
        setClients(clientsData)

    }, [clientsData])

    const handleDeleteClient = (id) => {
        deleteClient.mutate({ portfolioId: pid, itemId: id, type: "clients" }, {
            onSuccess: (data) => {
                setClients(data?.data?.clients)
                dispatch(showToast({ message: 'Client Deleted Successfully' }))
            },
            onError: (error) => dispatch(showToast({ message: error, type: 'error' }))
        })
    }

    return (
        <div className={`w-9/12 mx-auto place-items-center p-4 rounded my-5 border bg-] relative `}>
            <h2 className="text-2xl font-semibold mb-4">Clients</h2>
            {addClients && <AddClients uid={uid} setAddClients={setAddClients} pid={pid} onClientAdded={(newClients) => setClients(newClients)} />}

            {clients && clients.length === 0 ? (
                <div className="text-center">
                    <p className="text-gray-700 mb-4">No Clients available.</p>
                    <button
                        onClick={() => setAddClients(!addClients)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded"
                    >
                        Add Clients
                    </button>
                </div>
            ) : (
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border border-gray-300">
                        <thead className='text-center'>
                            <tr className="bg-purple-200">
                                <th className="py-2 px-4 border">Logo</th>
                                <th className="py-2 px-4 border">Name</th>
                                <th className="py-2 px-4 border">Action</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {clients?.map((client, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border place-items-center">
                                        <img
                                            className='w-15 h-10'
                                            src={client?.logoUrl ? `${url}${client.logoUrl}` : '../../assets/profile.jpg'} />
                                    </td>
                                    <td className="py-2 px-4 border">{client.name}</td>
                                    <td className="py-2 px-4 border">
                                        <button
                                            onClick={() => handleDeleteClient(client._id)}
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
                            onClick={() => setAddClients(!addClients)}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded"
                        >
                            Add Clients
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Clients
