import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useAddClients } from '../../hooks/usePortfolio';
import { showToast } from '../../redux/slice/ToastSlice';
import { X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';


function AddClients({ setAddClients, uid, pid, onClientAdded }) {
    const [clients, setClients] = useState([
        { id: uuidv4(), file: null, name: '' }
    ]);

    const dispatch = useDispatch();
    const addClients = useAddClients();

    // Handle input change for a specific cliemt
    const handleChange = (index, e) => {
        const { name, value, files } = e.target;
        const updatedClients = [...clients];
        if (name === 'images') {
            updatedClients[index].file = files[0];
        } else {
            updatedClients[index][name] = value;
        }
        setClients(updatedClients);
    };


    // Add a new blank clients (max 5 allowed)
    const addNewClients = () => {
        if (clients.length < 5) {
            setClients([...clients, { id: uuidv4(), file: null, name: '' }]);
        }
    };

    // Delete a specific client
    const removeService = (index) => {
        const updatedClients = clients.filter((_, i) => i !== index);
        setClients(updatedClients);

    };
    const validate = () => {
        for (let client of clients) {
            if (!client.name?.trim() || !client.file) {
                dispatch(showToast({ message: 'All client fields are required (name and logo)', type: 'warn' }));
                return false;
            }
        }
        return true;
    };


    const handleSubmitClients = () => {
        if (validate()) {
            const files = clients.map(client => client.file);
            const clientData = clients.map(client => ({ name: client.name }));

            addClients.mutate({ userId: uid, portfolioId: pid, clients: clientData, files }, {
                onSuccess: (data) => {
                    setAddClients(false);
                    onClientAdded(data?.data?.clients)
                    dispatch(showToast({ message: 'Clients Added Successfully' }))
                },
                onError: (error) => dispatch(showToast({ message: error, type: 'error' }))
            });
        }
    };

    return (
        <div className='w-full my-5  bg-white shadow-xl rounded-xl border overflow-clip'>
            <div className='flex justify-between p-2 bg-[#fb52c3] '>
                <h3 className='mx-3 text-xl font-semibold'>Add Clients</h3>
                <button className='cursor-pointer outline-0' onClick={() => setAddClients(false)}><X /></button>
            </div>

            <div className='w-10/12 mx-auto'>
                <div className='p-5 space-y-6'>
                    {clients.map((client, index) => (
                        <div key={client.id} className='relative border p-4 rounded space-y-4 shadow'>
                            {clients.length > 0 && (
                                <button
                                    onClick={() => removeService(index)}
                                    className='absolute top-2 right-2 text-gray-500 hover:text-red-600'
                                >
                                    <X size={18} />
                                </button>
                            )}
                            <div className='flex flex-col'>
                                <label htmlFor={`name-${index}`}>Client Name</label>
                                <input
                                    type='text'
                                    name="name"
                                    id={`name-${index}`}
                                    placeholder='Client Name'
                                    value={client.name}
                                    onChange={(e) => handleChange(index, e)}
                                    className='resize-none border p-1 rounded'
                                    required
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor={`logo-${index}`}>Logo</label>
                                <input
                                    type="file"
                                    name="images"
                                    id={`logo-${index}`}
                                    placeholder='Client Logo'
                                    // value={client.title}
                                    onChange={(e) => handleChange(index, e)}
                                    className='border p-1 rounded'
                                    required
                                />
                            </div>

                        </div>
                    ))}

                    {clients.length < 5 && (
                        <button
                            onClick={addNewClients}
                            className='border px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 focus:scale-95 text-white'
                        >
                            + Add Another Clients
                        </button>
                    )}
                </div>
            </div>

            <div className='flex gap-3 justify-end p-3'>
                <button className='border px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white' onClick={() => setAddClients(false)}>Cancel</button>
                <button className='border px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white font-sembold disabled:opacity-50 disabled:cursor-not-allowed' disabled={addClients.isPending} onClick={handleSubmitClients} >{addClients.isPending ? "Saving..." : "Save"}</button>
            </div>
        </div>
    )
}

export default AddClients
